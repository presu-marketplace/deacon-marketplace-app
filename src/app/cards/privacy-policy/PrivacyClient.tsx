'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { useRouter, useSearchParams } from 'next/navigation'

export default function PrivacyClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const langParam = searchParams.get('lang')

  const [locale, setLocale] = useState<'en' | 'es'>('es')

  useEffect(() => {
    if (langParam === 'es' || langParam === 'en') {
      setLocale(langParam)
    } else {
      const browserLang = navigator.language.startsWith('es') ? 'es' : 'en'
      setLocale(browserLang)
    }
  }, [langParam])

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'es' : 'en'
    setLocale(newLocale)
    router.push(`?lang=${newLocale}`)
  }

  const t = {
    login: locale === 'es' ? 'Iniciar sesión' : 'Log in',
    signup: locale === 'es' ? 'Crear cuenta' : 'Sign up',
    searchPlaceholder: locale === 'es' ? 'Buscar servicio...' : 'Search service...',
    language: locale === 'es' ? 'Español' : 'English',
    joinAsPro: locale === 'es' ? 'Unirse como proveedor' : 'Join as provider',
    howItWorks: locale === 'es' ? 'Cómo funciona Presu' : 'How Presu Works',
  }

  const content = {
    title: locale === 'es' ? 'Política de privacidad' : 'Privacy Policy',
    body:
      locale === 'es'
        ? `Fecha de vigencia: [Inserte fecha]

Tu privacidad es importante para nosotros. Esta Política de Privacidad explica cómo [Nombre de la empresa] recopila, utiliza y protege tu información personal.

1. Información que recopilamos

Datos personales que proporcionás (nombre, correo electrónico, teléfono).

Datos técnicos (dirección IP, navegador, información del dispositivo).

Datos de uso (páginas visitadas, tiempo de permanencia).

2. Cómo usamos tus datos

Para ofrecer y mejorar nuestros Servicios.

Para personalizar tu experiencia.

Para enviar actualizaciones, promociones o avisos importantes.

Para cumplir con obligaciones legales.

3. Compartir la información

No vendemos tus datos. Podemos compartirlos con:

Proveedores de servicios bajo estricta confidencialidad.

Autoridades cuando la ley lo requiera.

4. Seguridad de los datos

Implementamos medidas de seguridad estándar de la industria para proteger tus datos, pero no podemos garantizar seguridad absoluta.

5. Tus derechos

Según tu jurisdicción, podés tener derecho a:

Acceder, actualizar o eliminar tus datos.

Optar por no recibir comunicaciones de marketing.

Solicitar una copia de tus datos personales.

6. Contacto

Para consultas sobre esta Política de Privacidad, escribinos a: [Insert Contact Email]`
        : `Effective Date: [Insert Date]

Your privacy is important to us. This Privacy Policy explains how [Your Company Name] collects, uses, and protects your personal information.

1. Information We Collect

Personal data you provide (name, email, phone).

Technical data (IP address, browser, device info).

Usage data (pages visited, time spent).

2. How We Use Your Data

To provide and improve our Services.

To personalize your experience.

To send updates, promotions, or important notices.

To comply with legal obligations.

3. Sharing of Information

We do not sell your data. We may share with:

Service providers under strict confidentiality.

Authorities when required by law.

4. Data Security

We implement industry-standard safeguards to protect your data but cannot guarantee absolute security.

5. Your Rights

Depending on your jurisdiction, you may have rights to:

Access, update, or delete your data.

Opt-out of marketing communications.

Request a copy of your personal data.

6. Contact

For questions about this Privacy Policy, contact us at: [Insert Contact Email]`,
  }

  return (
    <>
      <Navbar locale={locale} toggleLocale={toggleLocale} t={t} forceWhite />
      <main className="bg-black text-white w-full pt-32 pb-24">
        <section className="max-w-4xl mx-auto px-6 sm:px-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 leading-tight">{content.title}</h1>
          <p className="text-gray-300 whitespace-pre-line">{content.body}</p>
        </section>
      </main>
    </>
  )
}

