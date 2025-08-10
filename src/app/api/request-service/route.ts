import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import type { SupabaseClient } from '@supabase/supabase-js'
import nodemailer, { type Attachment } from 'nodemailer'
import { randomUUID } from 'crypto'

export async function POST(request: Request) {
  let supabaseAdmin: SupabaseClient
  try {
    supabaseAdmin = getSupabaseAdmin()
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const formData = await request.formData()
  const service = String(formData.get('service') || '')
  const nombre = String(formData.get('nombre') || '')
  const email = String(formData.get('email') || '')
  const telefono = String(formData.get('telefono') || '')
  const tipoPropiedad = String(formData.get('tipoPropiedad') || '')
  const cleaningType = String(formData.get('cleaningType') || '')
  const direccion = String(formData.get('direccion') || '')
  const localidad = String(formData.get('localidad') || '')
  const mensaje = String(formData.get('mensaje') || '')
  const sistemas = JSON.parse(String(formData.get('sistemas') || '[]')) as string[]
  const lang = (formData.get('lang') === 'en' ? 'en' : 'es') as 'es' | 'en'
  const invoiceFiles = formData.getAll('invoices') as File[]
  const userId = String(formData.get('userId') || '')

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
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
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
    from: process.env.SMTP_FROM,
    to: 'rlabarile@analytxcg.com',
    subject,
    html,
    attachments
  })

  return NextResponse.json({ ok: true })
}
