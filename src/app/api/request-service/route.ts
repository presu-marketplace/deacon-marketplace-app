import { NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import nodemailer, { type Attachment } from 'nodemailer'
import { randomUUID } from 'crypto'

export async function POST(request: Request) {
  const {
    NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM
  } = process.env

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    return new Response('Missing SUPABASE_SERVICE_ROLE_KEY', { status: 500 })
  }
  if (!NEXT_PUBLIC_SUPABASE_URL) {
    return new Response('Missing NEXT_PUBLIC_SUPABASE_URL', { status: 500 })
  }
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    return new Response('Missing SMTP configuration', { status: 500 })
  }

  const supabaseAdmin: SupabaseClient = createClient(
    NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false }, db: { schema: 'api' } }
  )

  const contentType = request.headers.get('content-type') || ''
  let service = ''
  let nombre = ''
  let email = ''
  let telefono = ''
  let tipoPropiedad = ''
  let cleaningType = ''
  let direccion = ''
  let localidad = ''
  let mensaje = ''
  let sistemas: string[] = []
  let lang: 'es' | 'en' = 'es'
  let invoiceFiles: File[] = []
  let userId = ''

  if (contentType.includes('application/json')) {
    const body = await request.json()
    service = String(body.service || '')
    nombre = String(body.nombre || body.name || '')
    email = String(body.email || '')
    telefono = String(body.telefono || '')
    tipoPropiedad = String(body.tipoPropiedad || '')
    cleaningType = String(body.cleaningType || '')
    direccion = String(body.direccion || '')
    localidad = String(body.localidad || '')
    mensaje = String(body.mensaje || '')
    sistemas = Array.isArray(body.sistemas) ? body.sistemas : []
    lang = body.lang === 'en' ? 'en' : 'es'
    invoiceFiles = []
    userId = String(body.userId || '')
  } else {
    const formData = await request.formData()
    service = String(formData.get('service') || '')
    nombre = String(formData.get('nombre') || '')
    email = String(formData.get('email') || '')
    telefono = String(formData.get('telefono') || '')
    tipoPropiedad = String(formData.get('tipoPropiedad') || '')
    cleaningType = String(formData.get('cleaningType') || '')
    direccion = String(formData.get('direccion') || '')
    localidad = String(formData.get('localidad') || '')
    mensaje = String(formData.get('mensaje') || '')
    sistemas = JSON.parse(String(formData.get('sistemas') || '[]')) as string[]
    lang = (formData.get('lang') === 'en' ? 'en' : 'es') as 'es' | 'en'
    invoiceFiles = formData.getAll('invoices') as File[]
    userId = String(formData.get('userId') || '')
  }

  if (invoiceFiles.length > 3) {
    return NextResponse.json({ error: 'Too many invoices' }, { status: 400 })
  }
  for (const f of invoiceFiles) {
    if (f.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }
  }

  const invoiceUrls: string[] = []
  const attachments: Attachment[] = []

  for (const file of invoiceFiles) {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filePath = `${randomUUID()}-${file.name}`
    await supabaseAdmin.storage.from('invoices').upload(filePath, buffer, {
      contentType: 'application/pdf'
    })
    const { data } = supabaseAdmin.storage.from('invoices').getPublicUrl(filePath)
    invoiceUrls.push(data.publicUrl)
    attachments.push({ filename: file.name, content: buffer })
  }

  await supabaseAdmin.from('service_requests').insert({
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
    user_id: userId || null
  })

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  })

  attachments.push({
    filename: 'logo.png',
    path: `${process.cwd()}/public/logo/presu-02.png`,
    cid: 'presu-logo'
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
    from: email,
    to: 'rlabarile@analytixcg.com',
    subject,
    html,
    attachments,
    envelope: { from: SMTP_FROM, to: 'rlabarile@analytixcg.com' },
    replyTo: email
  })

  return NextResponse.json({ ok: true })
}
