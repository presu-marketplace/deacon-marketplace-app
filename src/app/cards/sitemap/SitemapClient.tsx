'use client'

import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Locale = 'en' | 'es'
const isLocale = (v: string | null): v is Locale => v === 'en' || v === 'es'

export default function SitemapClient() {
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

  const content = useMemo(() => {
    if (locale === 'es') {
      return {
        title: 'Mapa del sitio',
        lastUpdated: 'Actualizado el 27 de agosto de 2025',
        sections: [
          {
            title: 'Secciones principales',
            links: [
              { href: '/', label: 'Inicio', description: 'Introducción a nuestros servicios.' },
              { href: '/cards/market-comparison', label: 'Market Comparison', description: 'Potenciá tus compras.' },
              { href: '/cards/join-us', label: 'Join Us', description: 'Unite a Presu y conectá con nuevos clientes.' },
              { href: '/cards/sustainability', label: 'Sustainability', description: 'Comprometidos con la sostenibilidad.' },
              { href: '/services', label: 'Servicios', description: 'Soluciones disponibles.' },
              { href: '/help#contact', label: 'Ayuda y Contacto', description: 'Escribinos para consultas.' },
            ],
          },
          {
            title: 'Cuenta',
            links: [
              { href: '/auth/login', label: 'Iniciar sesión' },
              { href: '/auth/register', label: 'Crear cuenta' },
              { href: '/activity', label: 'Actividad' },
              { href: '/settings', label: 'Configuración' },
            ],
          },
          {
            title: 'Legal',
            links: [
              { href: '/cards/terms-of-use', label: 'Términos de uso' },
              { href: '/cards/privacy-policy', label: 'Política de privacidad' },
              { href: '/cards/accessibility-tools', label: 'Herramientas de accesibilidad' },
            ],
          },
        ],
        note: '¿No encontraste lo que buscabas? Probá la barra de búsqueda o escribinos a ',
      }
    }
    return {
      title: 'Sitemap',
      lastUpdated: 'Last updated August 27, 2025',
      sections: [
        {
          title: 'Core Sections',
          links: [
            { href: '/', label: 'Home', description: 'Overview of our services.' },
            { href: '/cards/market-comparison', label: 'Market Comparison', description: 'Boost your purchasing.' },
            { href: '/cards/join-us', label: 'Join Us', description: 'Join Presu and connect with new clients.' },
            { href: '/cards/sustainability', label: 'Sustainability', description: 'Committed to Sustainability.' },
            { href: '/services', label: 'Services', description: 'Available solutions.' },
            { href: '/help#contact', label: 'Help & Contact', description: 'Get assistance or contact us.' },
          ],
        },
        {
          title: 'Account',
          links: [
            { href: '/auth/login', label: 'Log in' },
            { href: '/auth/register', label: 'Sign up' },
            { href: '/activity', label: 'Activity' },
            { href: '/settings', label: 'Settings' },
          ],
        },
        {
          title: 'Legal',
          links: [
            { href: '/cards/terms-of-use', label: 'Terms of Use' },
            { href: '/cards/privacy-policy', label: 'Privacy Policy' },
            { href: '/cards/accessibility-tools', label: 'Accessibility Tools' },
          ],
        },
      ],
      note: "Can't find something? Try search or email ",
    }
  }, [locale])

  return (
    <>
      <Navbar locale={locale} toggleLocale={toggleLocale} t={navT} forceWhite />
      <main className="min-h-screen w-full bg-gradient-to-b from-neutral-950 via-black to-neutral-950 text-white pt-28 pb-24">
          <nav className="mx-auto mb-6 max-w-5xl px-6 sm:px-10 text-sm text-gray-400">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-gray-200 transition-colors">
                  {navT.home}
                </Link>
              </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-gray-100">{content.title}</span>
            </li>
          </ol>
        </nav>

        <section className="mx-auto max-w-5xl px-6 sm:px-10">
          <header className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">{content.title}</h1>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-gray-300">
                  <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-2" />
                    {content.lastUpdated}
                  </span>
                </p>
              </div>
            </div>
          </header>

          <div className="grid gap-8 sm:grid-cols-2">
            {content.sections.map((section) => (
              <div key={section.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h2 className="text-xl font-bold mb-4">{section.title}</h2>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="underline decoration-emerald-400/50 underline-offset-4 hover:decoration-emerald-300"
                      >
                        {link.label}
                      </Link>
                      {link.description && (
                        <p className="text-sm text-gray-300">{link.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-gray-400">
            {content.note}
            <a
              href="mailto:info@presu.com.ar"
              className="underline decoration-emerald-400/50 underline-offset-4 hover:decoration-emerald-300"
            >
              info@presu.com.ar
            </a>
            .
          </p>
        </section>
      </main>
    </>
  )
}
