'use client'

import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'

type Locale = 'en' | 'es'

function isLocale(v: string | null): v is Locale {
  return v === 'en' || v === 'es'
}

export default function TermsClient() {
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
        title: 'Términos de uso',
        lastUpdated: 'Actualizado el 27 de agosto de 2025',
        md: `> **Presu**  
> **Fecha de vigencia:** 27 de agosto de 2025

---

### 1. Aceptación de los términos
Al acceder o utilizar nuestro sitio web, servicios o aplicaciones (en adelante, los **“Servicios”**), aceptás estos Términos de Uso. Si no estás de acuerdo, no utilices los Servicios.

### 2. Elegibilidad
Debés tener **18 años** o la **mayoría de edad** en tu jurisdicción para usar los Servicios.

### 3. Uso de los Servicios
- No debés **interferir**, intentar **acceder sin autorización**, ni **abusar** de los Servicios.  
- Sos responsable de mantener la **confidencialidad** de tu cuenta.  
- Nos reservamos el derecho de **suspender o limitar** el acceso ante uso indebido.

### 4. Propiedad intelectual
El contenido del sitio (marcas, logotipos, texto, diseños, software) es de **Propiedad de Presu** o de sus licenciantes. **No** podés reproducirlo o explotarlo sin **autorización previa por escrito**.

### 5. Limitación de responsabilidad
Presu no será responsable por **daños indirectos, incidentales o consecuentes** derivados del uso de los Servicios, en la medida permitida por la ley.

### 6. Modificaciones
Podemos **actualizar** estos Términos en cualquier momento. El uso posterior de los Servicios implica la **aceptación** de los cambios.

### 7. Ley aplicable
Estos Términos se rigen por las **leyes de Argentina**.

---

Si tenés dudas, escribinos a **info@presu.com.ar**.`,
      }
    }
    return {
      title: 'Terms of Use',
      lastUpdated: 'Last updated August 27, 2025',
      md: `> **Presu**  
> **Effective Date:** August 27, 2025

---

### 1. Acceptance of Terms
By accessing or using our website, services, or applications (the **“Services”**), you agree to these Terms of Use. If you do not agree, do not use the Services.

### 2. Eligibility
You must be **18 years old** or the **age of majority** in your jurisdiction to use the Services.

### 3. Use of Services
- Do not **interfere with**, attempt **unauthorized access** to, or **abuse** the Services.  
- You are responsible for keeping your account **confidential**.  
- We may **suspend or limit** access for misuse.

### 4. Intellectual Property
All site content (marks, logos, text, designs, software) is **owned by Presu** or its licensors. You may **not** reproduce or exploit it without **prior written consent**.

### 5. Limitation of Liability
To the extent permitted by law, Presu is not liable for **indirect, incidental, or consequential** damages arising from use of the Services.

### 6. Modifications
We may **update** these Terms at any time. Continued use of the Services means you **accept** the changes.

### 7. Governing Law
These Terms are governed by the **laws of Argentina**.

---

Questions? Contact **info@presu.com.ar**.`,
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
              <Link href="/" className="hover:text-gray-200 transition-colors">
                {t.home}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-gray-300">{t.legal}</span>
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
          <article className="prose prose-invert prose-h1:mt-0 prose-headings:scroll-m-20 max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ ...props }) => (
                    <h2 className="mt-8 text-2xl font-bold tracking-tight" {...props} />
                  ),
                  h3: ({ ...props }) => (
                    <h3 className="mt-6 text-xl font-semibold tracking-tight" {...props} />
                  ),
                  p: ({ ...props }) => (
                    <p className="leading-relaxed text-gray-200" {...props} />
                  ),
                  li: ({ ...props }) => <li className="my-1" {...props} />,
                  blockquote: ({ ...props }) => (
                    <blockquote className="border-l-4 border-emerald-400/50 pl-4 text-gray-200/90" {...props} />
                  ),
                  hr: () => <hr className="my-8 border-white/10" />,
                  a: ({ ...props }) => (
                    <a className="underline decoration-emerald-400/50 underline-offset-4 hover:decoration-emerald-300" {...props} />
                  ),
                  strong: ({ ...props }) => <strong className="text-white" {...props} />,
                  ul: ({ ...props }) => <ul className="list-disc pl-6" {...props} />,
                  ol: ({ ...props }) => <ol className="list-decimal pl-6" {...props} />,
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
