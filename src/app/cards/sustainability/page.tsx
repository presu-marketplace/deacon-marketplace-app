'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

export default function SustainabilityPage() {
  const [locale, setLocale] = useState<'en' | 'es'>('es')

  const searchParams = useSearchParams()
  const langParam = searchParams.get('lang')

  useEffect(() => {
    if (langParam === 'es' || langParam === 'en') {
      setLocale(langParam)
    } else {
      const browserLang = navigator.language.startsWith('es') ? 'es' : 'en'
      setLocale(browserLang)
    }
  }, [langParam])

  const toggleLocale = () => {
    setLocale(prev => (prev === 'en' ? 'es' : 'en'))
  }

  const t = {
    login: locale === 'es' ? 'Iniciar sesión' : 'Log in',
    signup: locale === 'es' ? 'Crear cuenta' : 'Sign up',
    searchPlaceholder: locale === 'es' ? 'Buscar servicio...' : 'Search service...',
    language: locale === 'es' ? 'Español' : 'English',
    joinAsPro: locale === 'es' ? 'Unirse como proveedor' : 'Join as provider',
    howItWorks: locale === 'es' ? 'Cómo funciona Presu' : 'How Presu Works',

    title: locale === 'es'
      ? 'Comprometidos con la sostenibilidad'
      : 'Committed to Sustainability',

    subtitle: locale === 'es'
      ? 'En Presu, creemos que la innovación digital debe ir de la mano con la responsabilidad ambiental y social.'
      : 'At Presu, we believe digital innovation must go hand in hand with environmental and social responsibility.',

    intro: locale === 'es'
      ? 'Nuestro compromiso con la sustentabilidad no solo es una parte integral de nuestra misión, sino también una promesa concreta para construir un mundo más responsable y consciente.'
      : 'Our commitment to sustainability is not just part of our mission—it is a tangible promise to help build a more responsible and conscious world.',

    reasonsTitle: locale === 'es'
      ? '¿Por qué la sustentabilidad es clave para Presu?'
      : 'Why is sustainability key to Presu?',

    reasons: locale === 'es'
      ? [
        'Reducción del impacto ambiental: Digitalizamos el proceso de solicitud y comparación para minimizar uso de papel, desplazamientos y huella de carbono.',
        'Eficiencia energética: Nuestra infraestructura prioriza energías renovables y bajo consumo energético.',
        'Fomento de economías locales: Conectamos clientes con proveedores locales responsables y sostenibles.',
        'Educación y sensibilización: Compartimos contenidos y guías que fomentan decisiones más conscientes.',
        'Alianzas y medición de impacto: Colaboramos con organizaciones de sostenibilidad y reportamos nuestros avances.'
      ]
      : [
        'Reducing environmental impact: We digitize the request and comparison process to minimize paper use, travel, and carbon footprint.',
        'Energy efficiency: Our infrastructure prioritizes renewable energy and low energy consumption.',
        'Support for local economies: We connect clients with responsible, sustainable local providers.',
        'Education and awareness: We share content and guides that encourage more mindful decisions.',
        'Alliances and impact measurement: We partner with sustainability organizations and report our progress.'
      ],

    commitmentTitle: locale === 'es'
      ? 'Nuestro compromiso en acción:'
      : 'Our commitment in action:',

    commitment: locale === 'es'
      ? [
        'Digitalización integral para reducir el uso de recursos físicos.',
        'Uso de infraestructura tecnológica eficiente y energías renovables.',
        'Apoyo a proveedores locales y sostenibles.',
        'Promoción de prácticas responsables a través de contenidos educativos.',
        'Medición y reporte de nuestro impacto ambiental y social.'
      ]
      : [
        'Comprehensive digitization to reduce the use of physical resources.',
        'Use of efficient tech infrastructure and renewable energy.',
        'Support for local and sustainable providers.',
        'Promotion of responsible practices through educational content.',
        'Measurement and reporting of our environmental and social impact.'
      ],

    closing: locale === 'es'
      ? 'Juntos, podemos marcar la diferencia. En Presu, estamos convencidos de que la innovación y la sostenibilidad son los pilares para un futuro mejor.'
      : 'Together, we can make a difference. At Presu, we believe that innovation and sustainability are the pillars of a better future.',

    closing2: locale === 'es'
      ? 'Al elegirnos, accedés a una plataforma eficiente y transparente, y te unís a un movimiento por un mundo más responsable, inclusivo y respetuoso con el planeta.'
      : 'By choosing us, you gain access to an efficient, transparent platform—and join a movement for a more responsible, inclusive, and respectful world.',

    callToAction: locale === 'es'
      ? 'Ver más soluciones'
      : 'See more solutions'
  }

  return (
    <>
      <Navbar locale={locale} toggleLocale={toggleLocale} t={t} forceWhite />

      <main className="bg-black text-white w-full pt-32 pb-24">
        <section className="max-w-4xl mx-auto px-6 sm:px-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">{t.title}</h1>
          <p className="text-gray-300 text-lg mb-6">{t.subtitle}</p>
          <p className="text-gray-300 text-lg mb-10">{t.intro}</p>

          <Image
            src="/images/sustainability/hand-person-green-leaves.jpg"
            alt="Presu Sustentabilidad"
            width={1200}
            height={600}
            className="rounded-xl mb-10"
          />

          <h2 className="text-2xl font-semibold mb-4 text-white">{t.reasonsTitle}</h2>
          <ul className="list-disc pl-6 text-gray-300 mb-8 space-y-2">
            {t.reasons.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-semibold mb-4 text-white">{t.commitmentTitle}</h2>
          <ul className="list-disc pl-6 text-gray-300 mb-8 space-y-2">
            {t.commitment.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <p className="text-lg font-medium text-white mb-6">{t.closing}</p>
          <p className="text-lg text-gray-300 mb-10">{t.closing2}</p>

          <a
            href={`/?lang=${locale}`}
            className="inline-block bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition"
          >
            {t.callToAction}
          </a>
        </section>
      </main>
    </>
  )
}
