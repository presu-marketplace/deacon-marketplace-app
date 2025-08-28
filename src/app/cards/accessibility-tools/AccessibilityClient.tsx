'use client'

import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'

type Locale = 'en' | 'es'
const isLocale = (v: string | null): v is Locale => v === 'en' || v === 'es'

export default function AccessibilityClient() {
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

  // Sync locale if user navigates (back/forward)
  useEffect(() => {
    const param = searchParams.get('lang')
    if (isLocale(param) && param !== locale) setLocale(param)
  }, [searchParams, locale])

  // Helper to preserve other query params
  const pushWithLang = (newLocale: Locale) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('lang', newLocale)
    router.push(`${pathname}?${params.toString()}`)
  }

  // Exposed for Navbar if it triggers toggling
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
      accessibility: locale === 'es' ? 'Accesibilidad' : 'Accessibility',
    }),
    [locale]
  )

  const content = useMemo(() => {
    if (locale === 'es') {
      return {
        title: 'Herramientas de accesibilidad',
        lastUpdated: 'Actualizado el 27 de agosto de 2025',
        md: `> **Compromiso de Presu con la accesibilidad**

Nos comprometemos a que nuestro sitio sea usable por la mayor cantidad de personas posible, incluidas personas con discapacidades. Aspiramos a alinearnos con buenas prácticas de accesibilidad (por ejemplo, WCAG).

---

### Funciones de accesibilidad
- **Textos alternativos** en imágenes relevantes.  
- **Contraste suficiente** y soporte para **modo alto contraste** del sistema.  
- **Navegación por teclado** (enlaces, formularios, menús).  
- **Enfoque visible** al navegar con teclado.  
- **Diseño responsivo** para distintos tamaños de pantalla.  
- Etiquetas y roles **ARIA** cuando corresponde.

### Herramientas de asistencia recomendadas
- **Lectores de pantalla**: NVDA, JAWS, VoiceOver.  
- **Ampliación/zoom** del navegador y **ajuste de tamaño de texto**.  
- **Software de reconocimiento de voz** para dictado y control.

### Sugerencias de uso por teclado (atajos del navegador)
- **\`Tab\`** / **\`Shift + Tab\`**: mover foco hacia adelante/atrás.  
- **\`Enter\`**: activar vínculo o botón enfocado.  
- **\`Space\`**: activar controles o desplazarse.  
- **\`Ctrl/Cmd + +\`** y **\`Ctrl/Cmd + -\`**: acercar/alejar.

### Compatibilidad y limitaciones
Trabajamos para asegurar compatibilidad con navegadores modernos. Algunas combinaciones de navegador/extensiones/lectores de pantalla pueden comportarse de forma distinta. Si encontrás un problema, **contanos**.

### Comentarios y solicitudes
Mejoramos continuamente la accesibilidad. Si necesitás una **adaptación razonable** o querés reportar un problema, escribinos a **info@presu.com.ar**.  
Incluí si es posible: **URL**, **navegador**, **tecnología asistiva** y **pasos para reproducir**.

---

> ¿Querés saltear al contenido principal? Usá el vínculo “Saltar al contenido” al inicio de la página.`,
      }
    }
    return {
      title: 'Accessibility Tools',
      lastUpdated: 'Last updated August 27, 2025',
      md: `> **Presu’s commitment to accessibility**

We strive to make our site usable for as many people as possible, including people with disabilities. We aim to follow accessibility best practices (e.g., WCAG).

---

### Accessibility features
- **Alt text** for meaningful images.  
- **Sufficient color contrast** and support for system **high-contrast** modes.  
- **Keyboard navigation** for links, forms, and menus.  
- **Visible focus** when tabbing.  
- **Responsive design** across screen sizes.  
- Appropriate **ARIA** labels/roles where helpful.

### Assistive tools we support
- **Screen readers**: NVDA, JAWS, VoiceOver.  
- **Browser zoom** and **text resizing**.  
- **Speech recognition** tools for dictation and control.

### Keyboard tips (common browser shortcuts)
- **\`Tab\`** / **\`Shift + Tab\`**: move focus forward/backward.  
- **\`Enter\`**: activate focused link or button.  
- **\`Space\`**: toggle controls or scroll.  
- **\`Ctrl/Cmd + +\`** and **\`Ctrl/Cmd + -\`**: zoom in/out.

### Compatibility and known limitations
We work to ensure modern browser compatibility. Some combinations of browsers/extensions/screen readers may behave differently. If you encounter an issue, **let us know**.

### Feedback & accommodation requests
We continuously improve accessibility. If you need a **reasonable accommodation** or want to report an issue, email **info@presu.com.ar**.  
Please include: **URL**, **browser**, **assistive tech**, and **repro steps**, if possible.

---

> Want to skip to main content? Use the “Skip to content” link at the top of the page.`,
    }
  }, [locale])

  return (
    <>
      {/* Skip link for keyboard/screen readers */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-emerald-500 focus:px-3 focus:py-2 focus:text-black"
      >
        {locale === 'es' ? 'Saltar al contenido' : 'Skip to content'}
      </a>

      <Navbar locale={locale} toggleLocale={toggleLocale} t={t} forceWhite />

      <main
        id="main"
        role="main"
        className="min-h-screen w-full bg-gradient-to-b from-neutral-950 via-black to-neutral-950 text-white pt-28 pb-24"
      >
        {/* Breadcrumb */}
        <nav
          className="mx-auto mb-6 max-w-5xl px-6 sm:px-10 text-sm text-gray-400"
          aria-label={locale === 'es' ? 'Miga de pan' : 'Breadcrumb'}
        >
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
          <article className="prose prose-invert max-w-none">
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
                  ul: ({ ...props }) => <ul className="list-disc pl-6" {...props} />,
                  ol: ({ ...props }) => <ol className="list-decimal pl-6" {...props} />,
                  li: ({ ...props }) => <li className="my-1" {...props} />,
                  a: ({ ...props }) => (
                    <a className="underline decoration-emerald-400/50 underline-offset-4 hover:decoration-emerald-300" {...props} />
                  ),
                  hr: () => <hr className="my-8 border-white/10" />,
                  blockquote: ({ ...props }) => (
                    <blockquote className="border-l-4 border-emerald-400/50 pl-4 text-gray-200/90" {...props} />
                  ),
                  strong: ({ ...props }) => <strong className="text-white" {...props} />,
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
