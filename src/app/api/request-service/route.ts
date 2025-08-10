import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import nodemailer, { type Attachment } from 'nodemailer'
import { randomUUID } from 'crypto'

export async function POST(request: Request) {
  const formData = await request.formData()
  const service = String(formData.get('service') || '')
  const nombre = String(formData.get('nombre') || '')
  const email = String(formData.get('email') || '')
  const telefono = String(formData.get('telefono') || '')
  const tipoPropiedad = String(formData.get('tipoPropiedad') || '')
  const direccion = String(formData.get('direccion') || '')
  const localidad = String(formData.get('localidad') || '')
  const mensaje = String(formData.get('mensaje') || '')
  const sistemas = JSON.parse(String(formData.get('sistemas') || '[]')) as string[]
  const invoiceFiles = formData.getAll('invoices') as File[]

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
    direccion,
    localidad,
    mensaje,
    sistemas,
    invoice_urls: invoiceUrls
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

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: 'rlabarile@analytixcg.com',
    subject: `Nueva solicitud de servicio: ${service}`,
    html: `<div style="font-family:sans-serif"><img src="cid:presu-logo" alt="PRESU" style="height:40px"/><p>Nuevo pedido de ${nombre} (${email}) para ${service}.</p><p>${mensaje}</p></div>`,
    attachments
  })

  return NextResponse.json({ ok: true })
}
