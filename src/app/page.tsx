'use client'

import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import CategoriesSection from './components/CategoriesSection'
import Footer from './components/Footer'

export default function HomePage() {
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
      searchPlaceholder: 'What can we help you with?',
      language: 'English',
      terms: 'Terms of Use',
      privacy: 'Privacy Policy',
      sitemap: 'Sitemap',
      accessibility: 'Accessibility Tools',
      footerNote: 'Do Not Sell or Share My Personal Information',
      copyright: 'All rights reserved.',
      heroHeadline: '30 years of experience\nfinding the best pros.',
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
      applianceRepair: 'Appliance Repair'
    },
    es: {
      howItWorks: 'Cómo funciona',
      login: 'Iniciar sesión',
      signup: 'Crear cuenta',
      searchPlaceholder: '¿En qué podemos ayudarte?',
      language: 'Español',
      terms: 'Términos de uso',
      privacy: 'Política de privacidad',
      sitemap: 'Mapa del sitio',
      accessibility: 'Herramientas de accesibilidad',
      footerNote: 'No vender ni compartir mi información personal',
      copyright: 'Todos los derechos reservados.',
      heroHeadline: '30 años de experiencia\nencontrando a los mejores profesionales.',
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
      applianceRepair: 'Reparación de electrodomésticos'
    }
  }[locale]

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <Navbar locale={locale} toggleLocale={toggleLocale} t={t} />
      <HeroSection t={t} />
      <CategoriesSection t={t} />
      <Footer t={t} />
    </div>
  )
}