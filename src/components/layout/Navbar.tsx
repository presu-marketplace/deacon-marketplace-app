'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import SideMenu from './SideMenu'
import Link from 'next/link'
import useUser from '@/features/auth/useUser'
import UserMenu from './UserMenu'

type NavbarProps = {
  locale: 'en' | 'es'
  toggleLocale: () => void
  t: {
    howItWorks: string
    login: string
    signup: string
    searchPlaceholder: string
    language: string
    joinAsPro: string
  }
  forceWhite?: boolean
}

export default function Navbar({ locale, toggleLocale, t, forceWhite = false }: NavbarProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const user = useUser()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted) return null

  const isLightBg = forceWhite || scrolled
  const isLightText = forceWhite || (!scrolled && !forceWhite)

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${isLightBg
            ? forceWhite
              ? 'bg-white shadow-md border-b'
              : 'bg-white dark:bg-gray-950 shadow-md border-b'
            : 'bg-transparent'
          }`}
      >
        <div className="w-full flex items-center justify-between px-6 sm:px-10 lg:px-14 py-1.5">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="group p-2 rounded-full bg-transparent hover:bg-gray-800 transition duration-200"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className={`w-6 h-6 transition-colors duration-200 ${isLightText ? 'text-black group-hover:text-white' : 'text-white group-hover:text-white'
                  }`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div
              onClick={() => router.push(`/?lang=${locale}`)}
              className="cursor-pointer"
            >
              <Image
                src="/logo/presu-02.png"
                alt="Presu Logo"
                width={140}
                height={48}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Right: Language switch + Auth */}
          <div className="hidden md:flex items-center text-sm pr-14 gap-5 relative">
            <button
              onClick={toggleLocale}
              className={`flex items-center gap-1 transition-colors ${isLightText ? 'text-black hover:text-gray-700' : 'text-white hover:text-gray-300'
                }`}
              aria-label="Toggle Language"
            >
              <Image
                src={locale === 'es' ? '/icons/argentina-flag.svg' : '/icons/us-flag.svg'}
                alt={locale === 'es' ? 'Espa\u00f1ol - Argentina' : 'English - United States'}
                width={20}
                height={20}
                className="w-5 h-5 rounded-sm"
              />
              <span className="hidden sm:inline">{t.language}</span>
            </button>

            {user ? (
              <UserMenu user={user} locale={locale} />
            ) : (
              <>
                <button
                  onClick={() => router.push(`/auth/login?lang=${locale}`)}
                  className="bg-white text-black border border-gray-300 px-5 py-2 rounded-full font-medium hover:bg-gray-100 transition"
                >
                  {t.login}
                </button>

                <button
                  onClick={() => router.push(`/auth/register?lang=${locale}`)}
                  className="bg-black text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition"
                >
                  {t.signup}
                </button>
              </>
            )}
          </div>

          {/* Mobile spacer */}
          <div className="md:hidden w-6" />
        </div>
      </header>

      <SideMenu
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        locale={locale}
        toggleLocale={toggleLocale}
        t={t}
        forceWhite={forceWhite}
      />
    </>
  )
}