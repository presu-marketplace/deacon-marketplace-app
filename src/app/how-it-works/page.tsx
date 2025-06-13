'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Image from 'next/image'

export default function HowItWorksPage() {
  const [locale, setLocale] = useState<'en' | 'es'>('es')

  const t = {
    howItWorks: locale === 'es' ? 'Cómo funciona Presu' : 'How Presu Works',
    login: locale === 'es' ? 'Iniciar sesión' : 'Log in',
    signup: locale === 'es' ? 'Crear cuenta' : 'Sign up',
    searchPlaceholder: locale === 'es' ? 'Buscar servicio...' : 'Search service...',
    language: locale === 'es' ? 'Español' : 'English',
    joinAsPro: locale === 'es' ? 'Unirse como proveedor' : 'Join as provider',
  }

  const toggleLocale = () => {
    setLocale(prev => (prev === 'en' ? 'es' : 'en'))
  }

  return (
    <>
      <Navbar locale={locale} toggleLocale={toggleLocale} t={t} forceWhite />

      <main className="bg-white max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        {/* Ícono + título + bajada */}
        <div className="flex flex-col items-center text-center mb-12">
          <Image
            src="/icons/comparativa-icon.png"
            alt="Icono Presu"
            width={64}
            height={64}
            className="mb-4"
          />
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Comparativa de mercado
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-xl">
            Optimiza tus decisiones de compra con Presu: la mejor forma de comparar precios de mercado.
          </p>
        </div>

        {/* Contenido editorial */}
        <section className="space-y-6 text-gray-800 text-[15px] leading-relaxed">
          <p>
            En un entorno empresarial cada vez más competitivo, tomar decisiones informadas y eficientes es clave para maximizar recursos y reducir costos.
          </p>
          <p>
            En <strong>Presu</strong>, entendemos esa necesidad y por eso hemos desarrollado un servicio corporativo diseñado especialmente para empresas como la tuya. Nuestro servicio de comparación de precios de mercado te permite acceder a presupuestos competitivos y actualizados, facilitando la selección de proveedores confiables y responsables.
          </p>
          <p>
            Con una plataforma sencilla, transparente y alineada con prácticas sostenibles, te ayudamos a ahorrar tiempo, dinero y a tomar decisiones estratégicas que impulsen el crecimiento de tu negocio.
          </p>
          <p>
            Confía en <strong>Presu</strong> para potenciar tu gestión de compras y dar un paso más eficiente en tus decisiones.
          </p>
        </section>
      </main>
    </>
  )
}
