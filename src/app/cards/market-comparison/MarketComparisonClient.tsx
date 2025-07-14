'use client'

import Navbar from '@/components/layout/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MarketComparisonClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const langParam = searchParams.get('lang')

  const [locale, setLocale] = useState<'en' | 'es'>('en')

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
    heroTitle: locale === 'es' ? 'Potenciá tus compras' : 'Boost your purchasing',
    heroSubtitle: locale === 'es'
      ? 'Presu te da el control para tomar decisiones más inteligentes con datos confiables, proveedores validados y una plataforma simple y eficiente.'
      : 'Presu gives you control to make smarter decisions with trusted data, verified suppliers, and a simple, efficient platform.',
    heroDesc: locale === 'es'
      ? 'Optimizá tus decisiones de compras con Presu: la mejor forma de comparar precios de mercado.\n\nEn un entorno empresarial cada vez más competitivo, tomar decisiones informadas y eficientes es clave para maximizar recursos y reducir costos. En Presu, entendemos esa necesidad y por eso hemos desarrollado un servicio corporativo diseñado especialmente para empresas como la tuya. Nuestro servicio de comparación de precios de mercado te permite acceder a presupuestos competitivos y actualizados, facilitando la selección de proveedores confiables y responsables. Con una plataforma sencilla, transparente y alineada con prácticas sostenibles, te ayudamos a ahorrar tiempo, dinero y a tomar decisiones estratégicas que impulsen el crecimiento de tu negocio. Confiá en Presu para potenciar tu gestión de compras y dar un paso más eficiente en tus decisiones.'
      : 'Optimize your purchasing decisions with Presu: the best way to compare market prices.\n\nIn an increasingly competitive business environment, making informed and efficient decisions is key to maximizing resources and reducing costs. At Presu, we understand that need, which is why we have developed a corporate service specifically designed for companies like yours. Our market price comparison service gives you access to competitive and updated quotes, facilitating the selection of reliable and responsible suppliers. With a simple, transparent platform aligned with sustainable practices, we help you save time, money, and make strategic decisions that drive your business growth. Trust Presu to enhance your purchasing management and take a more efficient step in your decisions.',
    heroCtaPrimary: locale === 'es' ? 'Cómo empezar' : 'How to get started',
    heroCtaSecondary: locale === 'es' ? 'Ver nuestras soluciones' : 'Check out our solutions',
    sectionTitle: locale === 'es'
      ? 'Una solución corporativa pensada para vos'
      : 'A corporate solution built for you',
    benefit1Title: locale === 'es'
      ? 'Decisiones estratégicas con datos confiables'
      : 'Strategic decisions with trusted data',
    benefit1Text: locale === 'es'
      ? 'Accedé a presupuestos actualizados y seleccioná proveedores confiables para optimizar tu operación sin comprometer calidad ni tiempos.'
      : 'Access updated quotes and select trusted suppliers to optimize operations without compromising quality or timing.',
    benefit2Title: locale === 'es'
      ? 'Gestión simple, eficiente y sostenible'
      : 'Simple, efficient and sustainable management',
    benefit2Text: locale === 'es'
      ? 'Nuestra plataforma combina usabilidad con compromiso ambiental para que puedas ahorrar recursos y generar impacto positivo.'
      : 'Our platform combines usability with environmental commitment so you can save resources and generate positive impact.'
  }

  return (
    <>
      <Navbar locale={locale} toggleLocale={toggleLocale} t={t} forceWhite />
      <main className="bg-black text-white w-full pt-32 pb-24">
        <section className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">{t.heroTitle}</h1>
            <p className="text-gray-300 text-lg mb-8">{t.heroSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push(`/auth/register?lang=${locale}`)}
                className="bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-200 transition"
              >
                {t.heroCtaPrimary}
              </button>
              <Link href={`/solutions?lang=${locale}`}>
                <button className="text-white border border-white font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-black transition">
                  {t.heroCtaSecondary}
                </button>
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <Image
              src="/images/market-comparison/business-hero.jpg"
              alt="Business user"
              width={600}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 sm:px-12 mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-white">{t.sectionTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex gap-4 items-start">
              <Image
                src="/images/market-comparison/icon-strategic-decisions.png"
                alt="Data icon"
                width={48}
                height={48}
                className="mt-1"
              />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{t.benefit1Title}</h3>
                <p className="text-gray-300 text-sm">{t.benefit1Text}</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <Image
                src="/images/market-comparison/icon-smarter-business.png"
                alt="Sustainability icon"
                width={48}
                height={48}
                className="mt-1"
              />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{t.benefit2Title}</h3>
                <p className="text-gray-300 text-sm">{t.benefit2Text}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
