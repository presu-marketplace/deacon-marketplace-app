'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SitemapClient() {
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
    title: locale === 'es' ? 'Mapa del sitio' : 'Sitemap',
    body:
      locale === 'es'
        ? `Bienvenido al mapa del sitio de [Nombre de la empresa]. A continuación, encontrarás una guía rápida de las principales secciones de nuestro sitio web:

Inicio – Introducción a nuestros servicios

Sobre nosotros – Misión, valores y equipo de la empresa

Servicios – Resumen de las soluciones ofrecidas

Blog / Recursos – Artículos, información y novedades

Contacto – Ponete en contacto con nosotros

Legal

Términos de uso

Política de privacidad

Herramientas de accesibilidad`
        : `Welcome to the Sitemap of [Your Company Name]. Below is a quick guide to all main sections of our website:

Home – Introduction to our services

About Us – Company mission, values, and team

Services – Overview of solutions offered

Blog / Resources – Articles, insights, and updates

Contact – Get in touch with us

Legal

Terms of Use

Privacy Policy

Accessibility Tools`,
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

