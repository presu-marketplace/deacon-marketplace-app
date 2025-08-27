'use client'

import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const SUPPORTED_LOCALES = ['en', 'es'] as const
type Locale = (typeof SUPPORTED_LOCALES)[number]
const isLocale = (v: string | null): v is Locale => v === 'en' || v === 'es'

export default function SitemapClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Resolve initial locale (URL param > browser)
  const initialLocale: Locale = useMemo(() => {
    const param = searchParams.get('lang')
    if (isLocale(param)) return param
    if (typeof navigator !== 'undefined') {
      return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
    }
    return 'en'
  }, [searchParams])

  const [locale, setLocale] = useState<Locale>(initialLocale)

  // Sync locale if user navigates and lang changes
  useEffect(() => {
    const param = searchParams.get('lang')
    if (isLocale(param) && param !== locale) setLocale(param)
  }, [searchParams, locale])

  // URL helper to keep other params
  const pushWithLang = (newLocale: Locale) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('lang', newLocale)
    router.push(`${pathname}?${params.toString()}`)
  }

  // Exposed for Navbar if it toggles language
  const toggleLocale = () => {
    const next: Locale = locale === 'en' ? 'es' : 'en'
    setLocale(next)
    pushWithLang(next)
  }

  const t = useMemo(
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
        md: `> **Presu** – Navegación principal del sitio

---

### Secciones principales
- **[Inicio](/)** – Introducción a nuestros servicios.  
- **[Market Comparison](/cards/market-comparison)** – Potenciá tus compras.  
- **[Join Us](/cards/join-us)** – Unite a Presu y conectá con nuevos clientes.  
- **[Sustainability](/cards/sustainability)** – Comprometidos con la sostenibilidad.  
- **[Servicios](/services)** – Soluciones disponibles.  
- **[Contacto](/contact)** – Escribinos para consultas.

### Cuenta
- **[Iniciar sesión](/auth/login)**  
- **[Crear cuenta](/auth//register)**

### Legal
- **[Términos de uso](/cards/terms-of-use)**  
- **[Política de privacidad](/cards/privacy-policy)**  
- **[Herramientas de accesibilidad](/cards/accessibility-tools)**

---

> ¿No encontraste lo que buscabas? Probá la barra de búsqueda o escribinos a **info@presu.com.ar**.`,
      }
    }
    return {
      title: 'Sitemap',
      lastUpdated: 'Last updated August 27, 2025',
      md: `> **Presu** – Main site navigation

---

### Core Sections
- **[Home](/)** – Overview of our services.  
- **[Market Comparison](/cards/market-comparison)** – Boost your purchasing.  
- **[Join Us](/cards/join-us)** – Join Presu and connect with new clients.  
- **[Sustainability](/cards/sustainability)** – Committed to Sustainability.  
- **[Services](/services)** – Available solutions.  
- **[Contact](/contact)** – Get in touch.

### Account
- **[Log in](/auth/login)**  
- **[Sign up](/auth/register)**

### Legal
- **[Terms of Use](/cards/terms-of-use)**  
- **[Privacy Policy](/cards/privacy-policy)**  
- **[Accessibility Tools](/cards/accessibility-tools)**

---

> Can't find something? Try search or email **info@presu.com.ar**.`,
    }
  }, [locale])

  return (
    <>
      <Navbar locale={locale} toggleLocale={toggleLocale} t={t} forceWhite />
      <main className="min-h-screen w-full bg-gradient-to-b from-neutral-950 via-black to-neutral-950 text-white pt-28 pb-24">
        {/* Breadcrumb */}
        <nav className="mx-auto mb-6 max-w-5xl px-6 sm:px-10 text-sm text-gray-400">
          <ol className="flex items-center gap-2">
            <li>
              <a href="/" className="hover:text-gray-200 transition-colors">
                {t.home}
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-gray-100">{content.title}</span>
            </li>
          </ol>
        </nav>

        <section className="mx-auto max-w-5xl px-6 sm:px-10">
          {/* Header Card */}
          <header className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  {content.title}
                </h1>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-gray-300">
                  <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-2" />
                    {content.lastUpdated}
                  </span>
                </p>
              </div>
            </div>
          </header>

          {/* Markdown Body */}
          <article className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ node, ...props }) => (
                  <h2 className="mt-8 text-2xl font-bold tracking-tight" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="mt-6 text-xl font-semibold tracking-tight" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="leading-relaxed text-gray-200" {...props} />
                ),
                ul: ({ node, ...props }) => <ul className="list-disc pl-6" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-6" {...props} />,
                li: ({ node, ...props }) => <li className="my-1" {...props} />,
                a: ({ node, ...props }) => (
                  <a className="underline decoration-emerald-400/50 underline-offset-4 hover:decoration-emerald-300" {...props} />
                ),
                hr: () => <hr className="my-8 border-white/10" />,
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-emerald-400/50 pl-4 text-gray-200/90" {...props} />
                ),
                strong: ({ node, ...props }) => <strong className="text-white" {...props} />,
              }}
            >
              {content.md}
            </ReactMarkdown>
          </article>
        </section>
      </main>
    </>
  )
}
