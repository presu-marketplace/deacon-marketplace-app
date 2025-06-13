'use client'

import { useEffect, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import HeroSection from '../components/sections/home/HeroSection'
import CardSection from '../components/sections/home/CardSection'
import Footer from '../components/layout/Footer'
// import { redirect } from 'next/navigation'

export default function HomePage() {
  // Temporarily redirect homepage to under construction
  // redirect('/under-construction') 

  const [locale, setLocale] = useState<'es' | 'en'>('en')

  useEffect(() => {
    const browserLang = navigator.language.startsWith('es') ? 'es' : 'en'
    setLocale(browserLang as 'es' | 'en')
  }, [])

  const toggleLocale = () => setLocale(locale === 'en' ? 'es' : 'en')

  const t = {
    en: {
      howItWorks: 'How it works',
      login: 'Log In',
      signup: 'Sign Up',
      searchPlaceholder: 'Enter the requested service',
      language: 'English',
      terms: 'Terms of Use',
      privacy: 'Privacy Policy',
      sitemap: 'Sitemap',
      accessibility: 'Accessibility Tools',
      footerNote: 'Do Not Sell or Share My Personal Information',
      copyright: 'All rights reserved.',
      heroHeadline: 'Choose smarter, save more.',
      handyperson: 'Handyperson',
      landscaping: 'Landscaping',
      plumbing: 'Plumbing',
      electrical: 'Electrical',
      remodeling: 'Remodeling',
      roofing: 'Roofing',
      painting: 'Painting',
      cleaning: 'Cleaning',
      hvac: 'HVAC',
      windows: 'Windows',
      concrete: 'Concrete',
      applianceRepair: 'Appliance Repair',
      joinAsPro: 'Join as a Pro',

      // HeroSection
      location: 'Location',
      searchHere: 'Search here'
    },
    es: {
      howItWorks: 'Cómo funciona',
      login: 'Iniciar sesión',
      signup: 'Crear cuenta',
      searchPlaceholder: 'Introduce el servicio solicitado',
      language: 'Español',
      terms: 'Términos de uso',
      privacy: 'Política de privacidad',
      sitemap: 'Mapa del sitio',
      accessibility: 'Herramientas de accesibilidad',
      footerNote: 'No vender ni compartir mi información personal',
      copyright: 'Todos los derechos reservados.',
      heroHeadline: 'Elegí mejor, ahorrá más.',
      handyperson: 'Tareas generales',
      landscaping: 'Jardinería',
      plumbing: 'Plomería',
      electrical: 'Electricidad',
      remodeling: 'Remodelación',
      roofing: 'Techos',
      painting: 'Pintura',
      cleaning: 'Limpieza',
      hvac: 'Climatización',
      windows: 'Ventanas',
      concrete: 'Hormigón',
      applianceRepair: 'Reparación de electrodomésticos',
      joinAsPro: 'Unirse como profesional',

      // HeroSection
      location: 'Ubicación',
      searchHere: 'Buscar',
    }
  }[locale]

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <Navbar locale={locale} toggleLocale={toggleLocale} t={t} />

      {/* Full-width hero section */}
      <div className="w-full">
        <HeroSection t={t} />
      </div>

      {/* Optional padding wrapper for other sections */}
      <div className="w-full">
        <CardSection locale={locale} t={t} />
        <Footer t={t} />
      </div>
    </div>
  )
}