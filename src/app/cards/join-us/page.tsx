'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Image from 'next/image'

export default function JoinUsPage() {
  const [locale, setLocale] = useState<'en' | 'es'>('es')

  const toggleLocale = () => {
    setLocale(prev => (prev === 'en' ? 'es' : 'en'))
  }

  const t = {
    login: locale === 'es' ? 'Iniciar sesión' : 'Log in',
    signup: locale === 'es' ? 'Crear cuenta' : 'Sign up',
    searchPlaceholder: locale === 'es' ? 'Buscar servicio...' : 'Search service...',
    language: locale === 'es' ? 'Español' : 'English',
    joinAsPro: locale === 'es' ? 'Unirse como proveedor' : 'Join as provider',
    title: locale === 'es'
      ? 'Unite a Presu y conectá con nuevos clientes'
      : 'Join Presu and connect with new clients',
    subtitle: locale === 'es'
      ? 'Expandí tu negocio a través de una plataforma transparente, sustentable y orientada al crecimiento responsable.'
      : 'Grow your business through a transparent, sustainable, and purpose-driven platform.',
    intro: locale === 'es'
      ? 'En Presu, estamos revolucionando la forma en que los consumidores encuentran y comparan presupuestos para diversos servicios, y queremos que seas parte de esta innovación.'
      : 'At Presu, we are revolutionizing how consumers find and compare service quotes—and we want you to be part of that.',
    benefitsTitle: locale === 'es' ? '¿Por qué unirte a Presu?' : 'Why join Presu?',
    expectationsTitle: locale === 'es' ? '¿Qué buscamos en nuestros proveedores?' : 'What do we look for in our providers?',
    callToAction: locale === 'es' ? 'Registrate y empezá a recibir solicitudes' : 'Sign up and start receiving requests',
  }

  return (
    <>
      <Navbar locale={locale} toggleLocale={toggleLocale} t={t} forceWhite />
      <main className="bg-black text-white w-full pt-32 pb-24">
        <section className="max-w-4xl mx-auto px-6 sm:px-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 leading-tight">{t.title}</h1>
          <p className="text-lg text-gray-300 mb-8">{t.subtitle}</p>

          <Image
            src="/images/join-us/business-hand-shake.jpg"
            alt="Join Presu"
            width={1200}
            height={600}
            className="rounded-xl mb-10"
          />

          <p className="text-gray-300 text-base leading-relaxed mb-8 whitespace-pre-line">
            {t.intro}
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-white">{t.benefitsTitle}</h2>
          <ul className="list-disc pl-6 text-gray-300 mb-8 space-y-2">
            <li>Acceso a una red de clientes potenciales.</li>
            <li>Transparencia y competencia saludable.</li>
            <li>Compromiso con la sustentabilidad.</li>
            <li>Crecimiento y fidelización a largo plazo.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4 text-white">{t.expectationsTitle}</h2>
          <ul className="list-disc pl-6 text-gray-300 mb-8 space-y-2">
            <li>Compromiso con la calidad del servicio.</li>
            <li>Verificación de estándares sostenibles y responsables.</li>
            <li>Presupuestos competitivos y detallados.</li>
          </ul>

          <p className="text-lg font-medium text-white mb-6">
            ¿Listo para sumarte a esta comunidad innovadora?
          </p>

          <a
            href="/signup"
            className="inline-block bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition"
          >
            {t.callToAction}
          </a>
        </section>
      </main>
    </>
  )
}
