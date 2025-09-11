'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../components/layout/Navbar'
import HeroSection from '../components/sections/home/HeroSection'
import CardSection from '../components/sections/home/CardSection'
import Footer from '../components/layout/Footer'
import LocationPrompt from '../components/sections/home/LocationPrompt'
import TaglineSection from '../components/sections/home/TaglineSection'

export default function HomeClient() {
  const searchParams = useSearchParams()
  const langParam = searchParams.get('lang')

  const [locale, setLocale] = useState<'es' | 'en'>('en')
  const [userAddress, setUserAddress] = useState<string | null>(null)

  useEffect(() => {
    if (langParam === 'es' || langParam === 'en') {
      setLocale(langParam)
    } else {
      const browserLang = navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
      setLocale(browserLang)
    }

    const savedAddress = localStorage.getItem('userAddress')
    if (savedAddress) {
      setUserAddress(savedAddress)
    }
  }, [langParam])

  const toggleLocale = () => {
    const newLocale = locale === 'es' ? 'en' : 'es'
    setLocale(newLocale)
    const currentPath = window.location.pathname
    window.location.href = `${currentPath}?lang=${newLocale}`
  }

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
      tagline:
        'At Presu we connect companies with suppliers, offering multiple quotes in one place: easy, fast, transparent, and free.',
      easy: 'Easy',
      fast: 'Fast',
      transparent: 'Transparent',
      free: 'Free',
      joinAsPro: 'Join as a Pro',
      location: 'Location',
      searchHere: 'Search here',
      allowLocationTitle: 'Allow your location',
      allowLocationDescription: 'Skip the typing and see services near you',
      allowButton: 'Allow',
      typeAddressInstead: 'Type in service address instead',
      locationFallback: 'Your location',
      manualLocationPrompt: 'Enter your location:',
      changeLocation: 'Change',
      otherServices: 'Other services…',
      tellUs: 'Tell us what you need',
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
      tagline:
        'En Presu conectamos empresas con proveedores, ofreciendo múltiples presupuestos en un solo lugar: fácil, rápido, transparente y gratis.',
      easy: 'Fácil',
      fast: 'Rápido',
      transparent: 'Transparente',
      free: 'Gratis',
      joinAsPro: 'Unirse como profesional',
      location: 'Ubicación',
      searchHere: 'Buscar',
      allowLocationTitle: 'Permitir tu ubicación',
      allowLocationDescription: 'Omití el ingreso manual y descubrí servicios cerca tuyo',
      allowButton: 'Permitir',
      typeAddressInstead: 'Ingresar dirección manualmente',
      locationFallback: 'Tu ubicación',
      manualLocationPrompt: 'Ingresá tu ubicación:',
      changeLocation: 'Cambiar',
      otherServices: 'Otros servicios…',
      tellUs: 'Contanos qué necesitás',
    }
  }[locale]

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <Navbar locale={locale} toggleLocale={toggleLocale} t={t} />
      <div className="w-full space-y-24 bg-white">
        <LocationPrompt t={t} setUserAddress={setUserAddress} />
        <HeroSection locale={locale} t={t} userAddress={userAddress} />
        <TaglineSection t={t} />
        <CardSection locale={locale} t={t} />
        <Footer t={t} locale={locale} />
      </div>
    </div>
  )
}
