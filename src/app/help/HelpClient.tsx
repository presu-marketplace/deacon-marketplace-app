'use client'

import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { NAV_DICT, HELP_DICT, HelpLocale } from './dictionaries'

type Locale = 'en' | 'es'
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

  const replaceWithLang = (newLocale: Locale) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('lang', newLocale)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const toggleLocale = () => {
    const next: Locale = locale === 'en' ? 'es' : 'en'
    setLocale(next)
    replaceWithLang(next)
  }

  const navT = NAV_DICT[locale]
  const t = HELP_DICT[locale as HelpLocale]
  const lastUpdated = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date()),
    [locale]
  )

  const footerT = {
    terms: locale === 'es' ? 'Términos de uso' : 'Terms of Use',
    privacy: locale === 'es' ? 'Política de privacidad' : 'Privacy Policy',
    sitemap: locale === 'es' ? 'Mapa del sitio' : 'Sitemap',
    accessibility: locale === 'es' ? 'Accesibilidad' : 'Accessibility',
    footerNote:
      locale === 'es'
        ? 'No vender ni compartir mi información personal'
        : 'Do Not Sell or Share My Personal Information',
    copyright:
      locale === 'es'
        ? 'Todos los derechos reservados.'
        : 'All rights reserved.',
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute left-2 top-2 z-50 rounded bg-black px-3 py-2 text-white"
      >
        {t.skip}
      </a>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-neutral-950 via-black to-neutral-950 text-white">
        <Navbar locale={locale} toggleLocale={toggleLocale} t={navT} forceWhite />
        <Script
          id="contact-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ContactPage',
              url: 'https://presu.com.ar/help',
              mainEntity: {
                '@type': 'Organization',
                name: 'Presu',
                contactPoint: {
                  '@type': 'ContactPoint',
                  email: 'info@presu.com.ar',
                  contactType: 'customer support',
                  availableLanguage: ['English', 'Spanish'],
                },
              },
            }),
          }}
        />
        <main id="main-content" className="flex-grow pt-28 pb-24">
          <nav
            className="mx-auto mb-6 max-w-5xl px-6 text-sm text-gray-400 sm:px-10"
            aria-label={t.breadcrumbLabel}
          >
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-gray-200">
                  {navT.home}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span className="text-gray-100">{t.title}</span>
              </li>
            </ol>
          </nav>

          <section className="mx-auto max-w-5xl px-6 sm:px-10">
            <header className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{t.title}</h1>
              <p className="mt-2 text-sm text-gray-300">{t.intro}</p>
            </header>

            <div
              id="contact"
              className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <h2 className="mb-4 text-2xl font-bold">{t.contactHeading}</h2>
              <p className="text-gray-300">
                {t.contactDescription}{' '}
                <a
                  href={`mailto:info@presu.com.ar?subject=${encodeURIComponent(t.contactMailSubject)}`}
                  className="underline decoration-emerald-400/50 underline-offset-4 hover:decoration-emerald-300"
                >
                  info@presu.com.ar
                </a>
              </p>
            </div>

            <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="mb-4 text-2xl font-bold">{t.faqHeading}</h2>
              {t.faqs.map((faq, idx) => (
                <details key={idx} className="mb-4">
                  <summary className="cursor-pointer font-medium">{faq.question}</summary>
                  <p className="mt-2 text-gray-300">{faq.answer}</p>
                </details>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="mb-4 text-2xl font-bold">{t.quickLinksHeading}</h2>
              <ul className="space-y-2">
                {t.quickLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-emerald-400 hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-gray-400">
                {t.lastUpdatedLabel}: {lastUpdated}
              </p>
            </div>
          </section>
        </main>
        <Footer t={footerT} locale={locale} />
      </div>
    </>
  )
}
