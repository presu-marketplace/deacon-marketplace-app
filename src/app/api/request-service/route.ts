// app/api/request-service/route.ts
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import type Mail from 'nodemailer/lib/mailer'
import { randomUUID } from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'
export const maxDuration = 60

const isProd = process.env.NODE_ENV === 'production'

type JsonBody = {
  service?: string
  nombre?: string
  email?: string
  telefono?: string
  tipoPropiedad?: string
  cleaningType?: string
  frequency?: string[]
  direccion?: string
  localidad?: string
  mensaje?: string
  sistemas?: unknown[]
  lang?: 'es' | 'en'
  userId?: string
  deadline?: string // yyyy-mm-dd
}

async function parseBody(req: Request) {
  const ct = req.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    const j = (await req.json()) as JsonBody
    return { data: j, files: [] as File[] }
  }
  const fd = await req.formData()
  const s = (v: FormDataEntryValue | null) => (v == null ? '' : String(v))
  const data: JsonBody = {
    service: s(fd.get('service')),
    nombre: s(fd.get('nombre')),
    email: s(fd.get('email')),
    telefono: s(fd.get('telefono')),
    tipoPropiedad: s(fd.get('tipoPropiedad')),
    cleaningType: s(fd.get('cleaningType')),
    frequency: JSON.parse(s(fd.get('frequency') || '[]')),
    direccion: s(fd.get('direccion')),
    localidad: s(fd.get('localidad')),
    mensaje: s(fd.get('mensaje')),
    sistemas: JSON.parse(s(fd.get('sistemas') || '[]')),
    lang: (fd.get('lang') === 'en' ? 'en' : 'es') as 'es' | 'en',
    userId: s(fd.get('userId')),
    deadline: s(fd.get('deadline')),
  }
  const files = fd.getAll('invoices') as File[]
  return { data, files }
}

export async function POST(request: Request) {
  // Dev: inspect which key/role we’re using
  const qs = new URL(request.url).searchParams
  if (qs.get('who') === '1') {
    try {
      const k = process.env.SUPABASE_SERVICE_ROLE_KEY!
      const payload = JSON.parse(Buffer.from(k.split('.')[1], 'base64url').toString())
      return NextResponse.json({ jwt_role: payload.role, iss: payload.iss })
    } catch {
      return NextResponse.json({ error: 'bad key' }, { status: 500 })
    }
  }

  // 0) Supabase admin client (service-role; default schema = api via helper)
  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch (e) {
    if (!isProd) console.error('Admin client error:', e)
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const { data, files } = await parseBody(request)
  const {
    service, nombre, email, telefono,
    tipoPropiedad, cleaningType, frequency = [], direccion, localidad, mensaje,
    sistemas = [], lang = 'es', userId = '', deadline,
  } = data

  // 1) Validate files
  if (files.length > 3) return NextResponse.json({ error: 'Too many invoices' }, { status: 400 })
  for (const f of files) {
    if (f.type !== 'application/pdf') return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  // 2) Upload PDFs
  const invoiceUrls: string[] = []
  const mailAttachments: Mail.Attachment[] = []
  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = `${randomUUID()}-${file.name}`
    const { error: upErr } = await supabase.storage
      .from('invoices')
      .upload(filePath, buffer, { contentType: 'application/pdf', upsert: false })
    if (upErr) {
      if (!isProd) console.error('Upload failed:', upErr)
      return NextResponse.json({ error: 'Upload failed', details: upErr.message }, { status: 500 })
    }
    const { data: pub } = supabase.storage.from('invoices').getPublicUrl(filePath)
    invoiceUrls.push(pub.publicUrl)
    mailAttachments.push({ filename: file.name, content: buffer })
  }

  // 3) Resolve service_id from api.services view (slug or name)
  let service_id: string | null = null
  try {
    if (service?.trim()) {
      let q = await supabase.from('services').select('id,slug').eq('slug', service).maybeSingle()
      if (!q.data && !q.error) {
        q = await supabase
          .from('services')
          .select('id')
          .or(`name_en.eq.${service},name_es.eq.${service}`)
          .maybeSingle()
      }
      if (q?.data?.id) service_id = q.data.id
    }
  } catch (e) {
    if (!isProd) console.error('Service lookup error:', e)
  }

  // 4) Resolve user_id from profiles by email if not provided
  let user_id = userId?.trim() || null
  if (!user_id && email?.trim()) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle()
      if (profile?.id) user_id = profile.id
    } catch (e) {
      if (!isProd) console.error('User lookup error:', e)
    }
  }

  // 5) Build description + deadline
  const description =
    (mensaje?.trim() || '') ||
    `[${service || 'Servicio'}] ${tipoPropiedad || ''} ${cleaningType || ''} ${Array.isArray(frequency) ? frequency.join('/') : ''} — ${direccion || ''} ${localidad || ''}`
      .replace(/\s+/g, ' ')
      .trim() || null

  const deadlineDate =
    deadline && /^\d{4}-\d{2}-\d{2}$/.test(deadline) ? deadline : null

  // 6) Insert (explicit schema header for safety)
  const insertPayload = {
    user_id,      // your trigger validates client role if present
    service_id,
    service_description: description,
    service_location: localidad || direccion || null,
    service_deadline: deadlineDate,
    user_name: nombre || null,
    user_email: email || null,
    user_telephone: telefono || null,
    user_address: direccion || null,
    user_city: localidad || null,
    request_property_type: tipoPropiedad || null,
    request_cleaning_type: cleaningType || null,
    request_cleaning_frequency: Array.isArray(frequency) ? frequency.join('/') : null,
    request_message: mensaje || null,
    request_systems: sistemas,             // jsonb
    request_invoice_urls: invoiceUrls,     // text[]
  } as const

  const { data: inserted, error: dbErr } = await supabase
    .from('service_requests')
    .insert(insertPayload)
    .select('id')
    .single()

  if (dbErr) {
    if (!isProd) console.error('Insert failed:', dbErr)
    const err = dbErr as { details?: string | null; hint?: string | null }
    return NextResponse.json(
      { error: 'DB insert failed', code: dbErr.code, message: dbErr.message, details: err.details, hint: err.hint },
      { status: 500 }
    )
  }

  // 7) Email notification
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM)
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  mailAttachments.push({
    filename: 'logo.png',
    path: isProd
      ? 'https://payeutapaokdwxqxesyz.supabase.co/storage/v1/object/public/app/presu-02.png'
      : `${process.cwd()}/public/logo/presu-02.png`,
    cid: 'presu-logo',
  })

  const subject = lang === 'en' ? 'New service request' : 'Nueva solicitud de servicio'
  const html = lang === 'en'
    ? `
      <div style="background-color:#f9f9f9;padding:20px;font-family:Arial,sans-serif;color:#333;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="text-align:center;padding:20px 20px 0;">
              <img src="cid:presu-logo" alt="PRESU" style="height:60px"/>
            </td>
          </tr>
          <tr>
            <td style="padding:20px;text-align:center;">
              <h2 style="margin:0;font-size:20px;">New Service Request</h2>
              <p style="margin:10px 0 0;">${description || ''}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 20px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="font-weight:bold;padding:4px 0;">Name:</td><td>${nombre || ''}</td></tr>
                <tr><td style="font-weight:bold;padding:4px 0;">Email:</td><td>${email || ''}</td></tr>
                <tr><td style="font-weight:bold;padding:4px 0;">Phone:</td><td>${telefono || ''}</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `
    : `
      <div style="background-color:#f9f9f9;padding:20px;font-family:Arial,sans-serif;color:#333;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="text-align:center;padding:20px 20px 0;">
              <img src="cid:presu-logo" alt="PRESU" style="height:60px"/>
            </td>
          </tr>
          <tr>
            <td style="padding:20px;text-align:center;">
              <h2 style="margin:0;font-size:20px;">Nueva Solicitud de Servicio</h2>
              <p style="margin:10px 0 0;">${description || ''}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 20px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="font-weight:bold;padding:4px 0;">Nombre:</td><td>${nombre || ''}</td></tr>
                <tr><td style="font-weight:bold;padding:4px 0;">Email:</td><td>${email || ''}</td></tr>
                <tr><td style="font-weight:bold;padding:4px 0;">Teléfono:</td><td>${telefono || ''}</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      replyTo: email || undefined,
      to: 'info@presu.com.ar',
      subject,
      html,
      attachments: mailAttachments,
    })
  } catch (e) {
    if (!isProd) console.error('Mail send failed:', e)
    return NextResponse.json({ error: 'Mail send failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, id: inserted?.id })
}

// Debug-friendly GETs:
// - /api/request-service?who=1   → shows JWT role from your service key
// - /api/request-service?smoke=1 → minimal insert to test DB perms
export async function GET(request: Request) {
  const qs = new URL(request.url).searchParams

  if (qs.get('who') === '1') {
    try {
      const k = process.env.SUPABASE_SERVICE_ROLE_KEY!
      const payload = JSON.parse(Buffer.from(k.split('.')[1], 'base64url').toString())
      return NextResponse.json({ jwt_role: payload.role, iss: payload.iss })
    } catch {
      return NextResponse.json({ error: 'bad key' }, { status: 500 })
    }
  }

  if (qs.get('smoke') === '1') {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase
      .from('service_requests')
      .insert({
        service_description: 'smoke',
        service_location: 'local',
        request_systems: [],
        request_invoice_urls: [],
      })
      .select('id')
      .single()
    return error
      ? NextResponse.json({ error: 'DB insert failed', code: error.code, message: error.message }, { status: 500 })
      : NextResponse.json({ ok: true, mode: 'smoke' })
  }

  return NextResponse.json({ ok: true })
}
