'use client'

import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const SUPPORTED_LOCALES = ['en', 'es'] as const
 type Locale = (typeof SUPPORTED_LOCALES)[number]
 const isLocale = (v: string | null): v is Locale => v === 'en' || v === 'es'

export default function HelpClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialLocale: Locale = useMemo(() => {
    const param = searchParams.get('lang')
    if (isLocale(param)) return param
    if (typeof navigator !== 'undefined') {
      return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
    }
    return 'en'
  }, [searchParams])

  const [locale, setLocale] = useState<Locale>(initialLocale)

  useEffect(() => {
    const param = searchParams.get('lang')
    if (isLocale(param) && param !== locale) setLocale(param)
  }, [searchParams, locale])

  const pushWithLang = (newLocale: Locale) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('lang', newLocale)
    router.push(`${pathname}?${params.toString()}`)
  }

  const toggleLocale = () => {
    const next: Locale = locale === 'en' ? 'es' : 'en'
    setLocale(next)
    pushWithLang(next)
  }

  const navT = useMemo(
    () => ({
      login: locale === 'es' ? 'Iniciar sesión' : 'Log in',
      signup: locale === 'es' ? 'Crear cuenta' : 'Sign up',
      searchPlaceholder: locale === 'es' ? 'Buscar servicio...' : 'Search service...',
      language: locale === 'es' ? 'Español' : 'English',
      joinAsPro: locale === 'es' ? 'Unirse como proveedor' : 'Join as provider',
      howItWorks: locale === 'es' ? 'Cómo funciona Presu' : 'How Presu Works',
      home: locale === 'es' ? 'Inicio' : 'Home',
      legal: locale === 'es' ? 'Legal' : 'Legal',
    }),
    [locale]
  )

  const content = useMemo(
    () =>
      locale === 'es'
        ? {
            title: 'Ayuda y Contacto',
            intro: 'Encontrá respuestas o escribinos.',
            contactHeading: 'Contacto',
            contactDescription: 'Envíanos un correo a',
          }
        : {
            title: 'Help & Contact',
            intro: 'Find answers or reach out to us.',
            contactHeading: 'Contact',
            contactDescription: 'Send us an email at',
          },
    [locale]
  )

  return (
    <>
      <Navbar locale={locale} toggleLocale={toggleLocale} t={navT} forceWhite />
      <main className="min-h-screen w-full bg-gradient-to-b from-neutral-950 via-black to-neutral-950 text-white pt-28 pb-24">
        <nav className="mx-auto mb-6 max-w-5xl px-6 sm:px-10 text-sm text-gray-400">
          <ol className="flex items-center gap-2">
            <li>
              <a href="/" className="hover:text-gray-200 transition-colors">
                {navT.home}
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-gray-100">{content.title}</span>
            </li>
          </ol>
        </nav>

        <section className="mx-auto max-w-5xl px-6 sm:px-10">
          <header className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">{content.title}</h1>
            <p className="mt-2 text-sm text-gray-300">{content.intro}</p>
          </header>

          <div id="contact" className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-2xl font-bold mb-4">{content.contactHeading}</h2>
            <p className="text-gray-300">
              {content.contactDescription}{' '}
              <a
                href="mailto:info@presu.com.ar"
                className="underline decoration-emerald-400/50 underline-offset-4 hover:decoration-emerald-300"
              >
                info@presu.com.ar
              </a>
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
