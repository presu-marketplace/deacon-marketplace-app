'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const heroImages = [
  '/images/confident-young-brunette-caucasian-girl-holds-paint-brush-hammer-isolated-olive-green-background-with-copy-space.jpg',
  '/images/professional-male-technician-wearing-goggles-head-protective-mask-gloves-tool-belt-holding-drilling-machine.jpg',
  '/images/young-man-orange-t-shirt-wearing-rubber-gloves-holding-cleaning-spray-rug-looking-camera-with-smile-face-ready-clean-standing-purple-background.jpg'
]

export default function HomePage() {
  const router = useRouter()
  const [currentImage, setCurrentImage] = useState(0)
  const [locale, setLocale] = useState<'es' | 'en'>('en')

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const browserLang = navigator.language.startsWith('es') ? 'es' : 'en'
    setLocale(browserLang as 'es' | 'en')
  }, [])

  const toggleLocale = () => setLocale(locale === 'en' ? 'es' : 'en')

  const t = {
    'en': {
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
      heroHeadline: '30 years of experience\nfinding the best pros.'
    },
    'es': {
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
      heroHeadline: '30 años de experiencia\nencontrando a los mejores profesionales.'
    }
  }[locale]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 shadow-sm border-b">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold text-red-600">Presu</div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-800">
            <a href="#how-it-works" className="hover:text-red-600">{t.howItWorks}</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
        <button onClick={toggleLocale} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
          <img
              src={locale === 'es' ? '/icons/argentina-flag.svg' : '/icons/us-flag.svg'}
              alt={t.language}
              className="w-5 h-5 rounded-sm shrink-0"
            />
          {t.language}
          </button>

          <button
            onClick={() => router.push('/auth/login')}
            className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-100 text-sm font-medium"
          >
            {t.login}
          </button>

          <button
            onClick={() => router.push('/auth/register')}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm font-medium"
          >
            {t.signup}
          </button>

        </div>
      </header>

      {/* Hero Section - Fade Transition */}
      <section className="relative w-full h-[450px] overflow-hidden">
        {heroImages.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ease-in-out ${
              index === currentImage ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}

      <div className="absolute inset-0 flex justify-center items-center text-white text-center px-4 z-20">
        <div className="bg-black/60 rounded-xl px-6 py-8 max-w-2xl w-full shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-snug whitespace-pre-line">
          {t.heroHeadline}
        </h1>

          <div className="bg-white rounded-full flex items-center overflow-hidden w-full shadow-md">
            {/* Search input */}
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="px-4 py-3 flex-1 text-gray-700 focus:outline-none text-sm"
            />

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300 mx-2" />

            {/* Location */}
            <div className="flex items-center gap-1 text-gray-500 pr-4 text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM19.5 10.5C19.5 16 12 21 12 21S4.5 16 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <span>1772</span>
            </div>

            {/* Search button */}
            <button className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-r-full transition">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387-1.414 1.414-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      </section>

      {/* Categories */}
      <section id="how-it-works" className="px-6 py-10 border-b">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 text-center text-sm">
          {["Handyperson", "Landscaping", "Plumbing", "Electrical", "Remodeling", "Roofing", "Painting", "Cleaning", "HVAC", "Windows", "Concrete"].map((label, i) => (
            <div key={i} className="flex flex-col items-center gap-2 text-gray-700">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                {label[0]}
              </div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t text-gray-600 text-sm px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="text-red-600 font-bold text-lg">Presu</div>
            <ul className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
              <li><a href="#" className="hover:underline">{t.terms}</a></li>
              <li>|</li>
              <li><a href="#" className="hover:underline">{t.privacy}</a></li>
              <li>|</li>
              <li><a href="#" className="hover:underline">{t.sitemap}</a></li>
              <li>|</li>
              <li><a href="#" className="hover:underline">{t.accessibility}</a></li>
              <li>|</li>
              <li><a href="#" className="hover:underline">{t.footerNote}</a></li>
            </ul>
            <p className="text-xs mt-2 md:mt-0">&copy; {new Date().getFullYear()} PRESU. {t.copyright}</p>
          </div>

          <div className="flex gap-4 text-gray-500">
            {/* Twitter */}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-red-500 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.72 9.72 0 01-2.88 1.1A4.52 4.52 0 0012 4.85v1A10.66 10.66 0 013 3.15a4.48 4.48 0 001.4 6 4.41 4.41 0 01-2-.55v.06a4.52 4.52 0 003.63 4.42 4.5 4.5 0 01-2 .08 4.51 4.51 0 004.2 3.12A9.05 9.05 0 012 19.54a12.94 12.94 0 007 2.05c8.4 0 13-7 13-13v-.59A9.18 9.18 0 0023 3z" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-red-500 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512">
                <path d="M224.1 141c-63.6 0-115.1 51.5-115.1 115.1S160.5 371.2 224.1 371.2 339.2 319.7 339.2 256.1 287.7 141 224.1 141zm0 190.6c-41.8 0-75.5-33.8-75.5-75.5s33.8-75.5 75.5-75.5 75.5 33.8 75.5 75.5-33.7 75.5-75.5 75.5zm146.4-194.3c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-.7-14.9-4-29.5-10.2-43-6.2-13.5-15.1-25.4-26.1-36.4-11-11-22.9-19.9-36.4-26.1-13.5-6.2-28.1-9.5-43-10.2-17.1-.8-22.3-1-65.9-1s-48.9.2-65.9 1c-14.9.7-29.5 4-43 10.2-13.5 6.2-25.4 15.1-36.4 26.1-11 11-19.9 22.9-26.1 36.4-6.2 13.5-9.5 28.1-10.2 43-.8 17.1-1 22.3-1 65.9s.2 48.9 1 65.9c.7 14.9 4 29.5 10.2 43 6.2 13.5 15.1 25.4 26.1 36.4 11 11 22.9 19.9 36.4 26.1 13.5 6.2 28.1 9.5 43 10.2 17.1.8 22.3 1 65.9 1s48.9-.2 65.9-1c14.9-.7 29.5-4 43-10.2 13.5-6.2 25.4-15.1 36.4-26.1 11-11 19.9-22.9 26.1-36.4 6.2-13.5 9.5-28.1 10.2-43 .8-17.1 1-22.3 1-65.9s-.2-48.9-1-65.9zM398.8 388.1c-3.7 9.1-8.2 17.2-14.3 23.3-6.1 6.1-14.2 10.6-23.3 14.3-9 3.7-18.6 5.9-30.6 6.6-17.2.8-22.5 1-66.5 1s-49.3-.2-66.5-1c-12-.7-21.6-2.9-30.6-6.6-9.1-3.7-17.2-8.2-23.3-14.3-6.1-6.1-10.6-14.2-14.3-23.3-3.7-9-5.9-18.6-6.6-30.6-.8-17.2-1-22.5-1-66.5s.2-49.3 1-66.5c.7-12 2.9-21.6 6.6-30.6 3.7-9.1 8.2-17.2 14.3-23.3 6.1-6.1 14.2-10.6 23.3-14.3 9-3.7 18.6-5.9 30.6-6.6 17.2-.8 22.5-1 66.5-1s49.3.2 66.5 1c12 .7 21.6 2.9 30.6 6.6 9.1 3.7 17.2 8.2 23.3 14.3 6.1 6.1 10.6 14.2 14.3 23.3 3.7 9 5.9 18.6 6.6 30.6.8 17.2 1 22.5 1 66.5s-.2 49.3-1 66.5c-.7 12-2.9 21.6-6.6 30.6z"/>
              </svg>
            </a>
          </div>

        </div>
      </footer>
    </div>
  )
}