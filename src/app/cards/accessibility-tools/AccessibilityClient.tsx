'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AccessibilityClient() {
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
    title: locale === 'es' ? 'Herramientas de accesibilidad' : 'Accessibility Tools',
    body:
      locale === 'es'
        ? `En [Nombre de la empresa], estamos comprometidos a que nuestro sitio web sea accesible para todos los usuarios, incluidas las personas con discapacidades.

Funciones de accesibilidad

Textos alternativos para las imágenes.

Compatibilidad con modo de alto contraste.

Navegación mediante teclado.

Diseño responsivo para múltiples dispositivos.

Herramientas de asistencia

Recomendamos el uso de herramientas de accesibilidad de terceros, como:

Lectores de pantalla (p. ej., NVDA, JAWS, VoiceOver).

Opciones de zoom del navegador y cambio de tamaño del texto.

Software de reconocimiento de voz.

Comentarios

Mejoramos continuamente la accesibilidad. Si tenés dificultades para usar nuestro sitio, contactanos en: [Insert Contact Email]`
        : `At [Your Company Name], we are committed to making our website accessible to all users, including people with disabilities.

Accessibility Features

Text alternatives for images.

High-contrast mode support.

Keyboard navigation compatibility.

Responsive design for multiple devices.

Assistive Tools

We encourage the use of third-party accessibility tools, including:

Screen readers (e.g., NVDA, JAWS, VoiceOver).

Browser zoom and text resizing options.

Speech recognition software.

Feedback

We are continuously improving accessibility. If you experience difficulty using our site, please contact us at: [Insert Contact Email]`,
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

