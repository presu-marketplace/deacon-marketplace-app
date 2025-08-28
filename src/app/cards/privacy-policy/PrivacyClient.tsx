'use client'

import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'

type Locale = 'en' | 'es'
const isLocale = (v: string | null): v is Locale => v === 'en' || v === 'es'

export default function PrivacyClient() {
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

  // Sync locale if user navigates (back/forward) and lang changes
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

  // Exposed for Navbar (if it calls toggleLocale)
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
        title: 'Política de privacidad',
        lastUpdated: 'Actualizado el 27 de agosto de 2025',
        md: `> **Presu**  
> **Fecha de vigencia:** 27 de agosto de 2025

---

### 1. Información que recopilamos
- **Datos personales** que proporcionás: nombre, correo electrónico, teléfono.  
- **Datos técnicos**: dirección IP, navegador, sistema operativo y tipo de dispositivo.  
- **Datos de uso**: páginas visitadas, interacciones, tiempo de permanencia y referencias.

### 2. Cómo usamos tus datos
- **Proveer y mejorar** nuestros Servicios.  
- **Personalizar** tu experiencia (por ejemplo, idioma o contenido relevante).  
- **Comunicaciones** operativas, avisos importantes y novedades (podés darte de baja).  
- **Cumplimiento legal** y **seguridad**, incluyendo prevención de fraude.

### 3. Base legal para el tratamiento
Tratamos datos sobre la base de: **ejecución del contrato**, **interés legítimo**, **consentimiento** (cuando aplique) y **obligaciones legales** de acuerdo con las leyes de **Argentina**.

### 4. Compartir la información
No **vendemos** tus datos. Podemos compartirlos con:
- **Proveedores de servicios** (por ejemplo, hosting, analítica) bajo **acuerdos de confidencialidad**.  
- **Autoridades** cuando la ley lo requiera o para proteger nuestros derechos.

### 5. Seguridad de los datos
Aplicamos **medidas de seguridad** razonables y alineadas con la industria. Si bien nos esforzamos por proteger la información, **ningún sistema es 100% seguro**.

### 6. Retención
Conservamos la información por el **tiempo necesario** para los fines descriptos y según **requisitos legales o regulatorios**.

### 7. Tus derechos
Dependiendo de tu jurisdicción y sujeto a la normativa aplicable, podés:
- **Acceder**, **actualizar** o **eliminar** tus datos.  
- **Oponerte** o **restringir** ciertos tratamientos.  
- **Retirar tu consentimiento** cuando el tratamiento se base en él.  
- **Solicitar portabilidad** de tus datos.

Para ejercerlos, escribinos a **info@presu.com.ar**. Es posible que solicitemos **verificación de identidad**.

### 8. Menores
Nuestros Servicios no están dirigidos a **menores de 18 años**. Si detectamos datos de menores, **los eliminaremos** razonablemente.

### 9. Transferencias internacionales
Si transferimos datos fuera de tu país, aplicaremos **salvaguardas adecuadas** (por ejemplo, cláusulas contractuales).

### 10. Cambios a esta política
Podemos **actualizar** esta Política. Publicaremos la versión vigente con la **fecha de actualización**.

---

¿Dudas o solicitudes? Escribinos a **info@presu.com.ar**.`,
      }
    }
    return {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated August 27, 2025',
      md: `> **Presu**  
> **Effective Date:** August 27, 2025

---

### 1. Information We Collect
- **Personal data** you provide: name, email, phone.  
- **Technical data**: IP address, browser, OS, device type.  
- **Usage data**: pages viewed, interactions, session duration, referrals.

### 2. How We Use Your Data
- To **provide and improve** our Services.  
- To **personalize** your experience (e.g., language, relevant content).  
- For **operational communications**, important notices, and updates (you can opt out).  
- For **legal compliance** and **security**, including fraud prevention.

### 3. Legal Bases
We process data based on **contract performance**, **legitimate interests**, **consent** (where applicable), and **legal obligations** under the laws of **Argentina**.

### 4. Sharing of Information
We do **not sell** your data. We may share it with:  
- **Service providers** (e.g., hosting, analytics) under **confidentiality agreements**.  
- **Authorities** where required by law or to protect our rights.

### 5. Data Security
We implement **industry-standard safeguards**. While we strive to protect information, **no system is 100% secure**.

### 6. Data Retention
We keep information for as long as **necessary** to fulfill the purposes described and to meet **legal/regulatory** requirements.

### 7. Your Rights
Subject to applicable law, you may:  
- **Access**, **update**, or **delete** your data.  
- **Object to** or **restrict** certain processing.  
- **Withdraw consent** where processing relies on it.  
- **Request data portability**.

To exercise your rights, contact **info@presu.com.ar**. We may ask for **identity verification**.

### 8. Children
The Services are not directed to **children under 18**. If we become aware of such data, we will **delete** it within a reasonable time.

### 9. International Transfers
Where we transfer data across borders, we apply **appropriate safeguards** (e.g., contractual clauses).

### 10. Changes to This Policy
We may **update** this Policy from time to time. We will post the current version with the **last updated** date.

---

Questions or requests? Contact **info@presu.com.ar**.`,
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
