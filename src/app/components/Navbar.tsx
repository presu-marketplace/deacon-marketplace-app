'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

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
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 backdrop-blur-sm shadow-sm border-b px-6 py-3 flex justify-between items-center">
      
      {/* Left side: Brand and navigation */}
      <div className="flex items-center gap-8">
        {/* Brand Logo */}
        <div className="text-2xl font-bold text-red-600">Presu</div>

        {/* Navigation links (visible only on md+ screens) */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-800 dark:text-gray-200" role="navigation">
          <a href="#how-it-works" className="hover:text-red-600 transition">
            {t.howItWorks}
          </a>
        </nav>
      </div>

      {/* Right side: auth buttons, language toggle, and Join as a Pro */}
      <div className="flex items-center gap-4">
        {/* Language toggle button */}
        <button
          onClick={toggleLocale}
          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          aria-label="Toggle Language"
        >
          <img
            src={locale === 'es' ? '/icons/argentina-flag.svg' : '/icons/us-flag.svg'}
            alt={locale === 'es' ? 'Español - Argentina' : 'English - United States'}
            className="w-5 h-5 rounded-sm shrink-0"
          />
          <span className="hidden sm:inline">{t.language}</span>
        </button>

        {/* Join as a Pro button */}
        <button
          onClick={() => router.push('/auth/register?role=pro')}
          className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-red-600"
          aria-label="Join as a Pro"
        >
          Join as a Pro
        </button>

        {/* Login button */}
        <button
          onClick={() => router.push('/auth/login')}
          className="border border-gray-300 dark:border-gray-600 px-4 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium"
          aria-label={t.login}
        >
          {t.login}
        </button>

        {/* Signup button */}
        <button
          onClick={() => router.push('/auth/register')}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm font-medium"
          aria-label={t.signup}
        >
          {t.signup}
        </button>
      </div>

    </header>
  )
}
