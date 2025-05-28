'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import MobileMenu from './MobileMenu'

// Props for Navbar component, including i18n strings and language toggling logic
type NavbarProps = {
  locale: 'en' | 'es' // Current locale (English or Spanish)
  toggleLocale: () => void // Function to switch language
  t: {
    howItWorks: string
    login: string
    signup: string
    searchPlaceholder: string
    language: string
    joinAsPro: string
  }
}

export default function Navbar({ locale, toggleLocale, t }: NavbarProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch on client-side rendering (Next.js)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted on the client
  if (!mounted) return null

  return (
    // Fixed/sticky navbar at the top with blur and shadow
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 backdrop-blur-sm shadow-sm border-b px-4 sm:px-6 py-3 flex justify-between items-center">
      {/* Left: Brand */}
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold text-red-600">Presu</div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-800 dark:text-gray-200">
          <a href="#how-it-works" className="hover:text-red-600 transition">{t.howItWorks}</a>
        </nav>
      </div>

      {/* Right: Desktop menu */}
      <div className="hidden md:flex items-center gap-4">
        {/* Language toggle */}
        <button
          onClick={toggleLocale}
          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          aria-label="Toggle Language"
        >
          <Image
            src={locale === 'es' ? '/icons/argentina-flag.svg' : '/icons/us-flag.svg'}
            alt={locale === 'es' ? 'Español - Argentina' : 'English - United States'}
            width={20}
            height={20}
            className="w-5 h-5 rounded-sm"
          />
          <span className="hidden sm:inline">{t.language}</span>
        </button>

        <button onClick={() => router.push(`/auth/register?role=pro&lang=${locale}`)} className="text-sm font-medium hover:text-red-600">
          {t.joinAsPro}
        </button>
        <button onClick={() => router.push(`/auth/login?lang=${locale}`)} className="border px-4 py-1 rounded text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
          {t.login}
        </button>
        <button onClick={() => router.push(`/auth/register?lang=${locale}`)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm font-medium">
          {t.signup}
        </button>
      </div>

      {/* Right: Mobile menu toggle */}
      <MobileMenu t={t} locale={locale} toggleLocale={toggleLocale} router={router} />
    </header>

  )
}
