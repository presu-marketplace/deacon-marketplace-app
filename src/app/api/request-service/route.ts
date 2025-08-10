export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import nodemailer, { type Attachment } from 'nodemailer'
import { randomUUID } from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

async function parseBody(req: Request) {
  const ct = req.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    const j = await req.json()
    return { data: j, files: [] as File[] }
  }
  const fd = await req.formData()
  const toObj = (v: FormDataEntryValue | null) => (v == null ? '' : String(v))
  const data = {
    service: toObj(fd.get('service')),
    nombre: toObj(fd.get('nombre')),
    email: toObj(fd.get('email')),
    telefono: toObj(fd.get('telefono')),
    tipoPropiedad: toObj(fd.get('tipoPropiedad')),
    cleaningType: toObj(fd.get('cleaningType')),
    direccion: toObj(fd.get('direccion')),
    localidad: toObj(fd.get('localidad')),
    mensaje: toObj(fd.get('mensaje')),
    sistemas: JSON.parse(toObj(fd.get('sistemas') || '[]')),
    lang: (fd.get('lang') === 'en' ? 'en' : 'es') as 'es' | 'en',
    userId: toObj(fd.get('userId')),
  }
  const files = fd.getAll('invoices') as File[]
  return { data, files }
}

export async function POST(request: Request) {
  let supabaseAdmin
  try {
    supabaseAdmin = getSupabaseAdmin()
  } catch {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const { data, files } = await parseBody(request)
  const {
    service,
    nombre,
    email,
    telefono,
    tipoPropiedad,
    cleaningType,
    direccion,
    localidad,
    mensaje,
    sistemas = [],
    lang = 'es',
    userId = '',
  } = data

  if (files.length > 3)
    return NextResponse.json({ error: 'Too many invoices' }, { status: 400 })
  for (const f of files)
    if (f.type !== 'application/pdf')
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })

  const invoiceUrls: string[] = []
  const attachments: Attachment[] = []
  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = `${randomUUID()}-${file.name}`
    const { error } = await supabaseAdmin.storage
      .from('invoices')
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      })
    if (error)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    const { data: pub } = supabaseAdmin.storage
      .from('invoices')
      .getPublicUrl(filePath)
    invoiceUrls.push(pub.publicUrl)
    attachments.push({ filename: file.name, content: buffer })
  }

  const { error: dbErr } = await supabaseAdmin.from('service_requests').insert({
    service,
    nombre,
    email,
    telefono,
    tipo_propiedad: tipoPropiedad,
    cleaning_type: cleaningType,
    direccion,
    localidad,
    mensaje,
    sistemas,
    invoice_urls: invoiceUrls,
    user_id: userId || null,
  })
  if (dbErr)
    return NextResponse.json({ error: 'DB insert failed' }, { status: 500 })

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM)
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  attachments.push({
    filename: 'logo.png',
    path: `${process.cwd()}/public/logo/presu-02.png`,
    cid: 'presu-logo',
  })

  const subject =
    lang === 'en'
      ? `New service request: ${service}`
      : `Nueva solicitud de servicio: ${service}`

  const html =
    lang === 'en'
      ? `<div style="font-family:sans-serif"><img src="cid:presu-logo" alt="PRESU" style="height:60px"/><h2>New Service Request</h2><p>You have received a new request for <strong>${service}</strong>.</p><p><strong>Name:</strong> ${nombre}<br/><strong>Email:</strong> ${email}<br/><strong>Phone:</strong> ${telefono}</p><p>${mensaje}</p></div>`
      : `<div style="font-family:sans-serif"><img src="cid:presu-logo" alt="PRESU" style="height:60px"/><h2>Nueva Solicitud de Servicio</h2><p>Has recibido una nueva solicitud para <strong>${service}</strong>.</p><p><strong>Nombre:</strong> ${nombre}<br/><strong>Email:</strong> ${email}<br/><strong>Teléfono:</strong> ${telefono}</p><p>${mensaje}</p></div>`

  await transporter.sendMail({
    from: SMTP_FROM,
    replyTo: email || undefined,
    to: 'rlabarile@analytixcg.com',
    subject,
    html,
    attachments,
  })

  return NextResponse.json({ ok: true })
}

