'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { useRouter, useSearchParams } from 'next/navigation'

export default function TermsClient() {
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
    title: locale === 'es' ? 'Términos de uso' : 'Terms of Use',
    body:
      locale === 'es'
        ? `Fecha de vigencia: [Inserte fecha]

Bienvenido a [Nombre de la empresa]. Al acceder o utilizar nuestro sitio web, servicios o aplicaciones (colectivamente, los "Servicios"), aceptas estar sujeto a estos Términos de Uso.

1. Aceptación de los términos

Al utilizar nuestros Servicios, reconoces que has leído, comprendido y aceptas cumplir estos Términos.

2. Elegibilidad

Debes tener al menos 18 años (o la mayoría de edad en tu jurisdicción) para usar nuestros Servicios.

3. Uso de los Servicios

Aceptas no hacer un uso indebido ni interferir con nuestros Servicios.

Sos responsable de mantener la confidencialidad de tu cuenta.

El uso o acceso no autorizado está estrictamente prohibido.

4. Propiedad intelectual

Todo el contenido, las marcas y los materiales de este sitio son propiedad de [Nombre de la empresa] o de sus licenciantes. No podés reproducir, distribuir ni explotarlos sin consentimiento previo por escrito.

5. Limitación de responsabilidad

[Nombre de la empresa] no es responsable por daños indirectos, incidentales o consecuentes derivados del uso de los Servicios.

6. Modificaciones

Nos reservamos el derecho de actualizar o modificar estos Términos en cualquier momento. El uso continuado de nuestros Servicios después de los cambios implica aceptación.

7. Ley aplicable

Estos Términos se rigen por las leyes de [Tu jurisdicción].`
        : `Effective Date: [Insert Date]

Welcome to [Your Company Name]. By accessing or using our website, services, or applications (collectively, the "Services"), you agree to be bound by these Terms of Use.

1. Acceptance of Terms

By using our Services, you acknowledge that you have read, understood, and agree to comply with these Terms.

2. Eligibility

You must be at least 18 years old (or the age of majority in your jurisdiction) to use our Services.

3. Use of Services

You agree not to misuse or interfere with our Services.

You are responsible for maintaining the confidentiality of your account.

Unauthorized use or access is strictly prohibited.

4. Intellectual Property

All content, trademarks, and materials on this site are the property of [Your Company Name] or its licensors. You may not reproduce, distribute, or exploit them without prior written consent.

5. Limitation of Liability

[Your Company Name] is not liable for indirect, incidental, or consequential damages resulting from your use of the Services.

6. Modifications

We reserve the right to update or modify these Terms at any time. Continued use of our Services after changes indicates acceptance.

7. Governing Law

These Terms are governed by the laws of [Your Jurisdiction].`,
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

