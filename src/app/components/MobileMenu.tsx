'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'

type MobileMenuProps = {
  t: {
    howItWorks: string
    login: string
    signup: string
    searchPlaceholder: string
    language: string
    joinAsPro: string
  }
  locale: 'en' | 'es'
  toggleLocale: () => void
  router: AppRouterInstance
}

export default function MobileMenu({ t, locale, toggleLocale, router }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* ☰ Toggle Button */}
      <div className="md:hidden relative z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-600 dark:text-gray-300 text-2xl"
          aria-label="Toggle Menu"
        >
          {isOpen ? '✖' : '☰'}
        </button>
      </div>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
          aria-hidden="true"
        />
      )}

      {/* Slide-down menu */}
      <div
        className={`md:hidden fixed right-4 top-16 w-60 bg-white dark:bg-gray-900 shadow-lg rounded-md border dark:border-gray-700 p-4 z-50 space-y-3 text-sm transform transition-transform duration-300 ease-out ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={toggleLocale}
          className="flex items-center gap-2 w-full text-left hover:text-red-500"
        >
          <Image
            src={locale === 'es' ? '/icons/argentina-flag.svg' : '/icons/us-flag.svg'}
            alt="Toggle Language"
            width={20}
            height={20}
            className="w-5 h-5 rounded-sm"
          />
          {t.language}
        </button>

        <button
          onClick={() => {
            router.push(`/auth/register?role=pro&lang=${locale}`)
            setIsOpen(false)
          }}
          className="w-full text-left hover:text-red-500"
        >
          {t.joinAsPro}
        </button>

        <button
          onClick={() => {
            router.push(`/auth/login?lang=${locale}`)
            setIsOpen(false)
          }}
          className="w-full text-left hover:text-red-500"
        >
          {t.login}
        </button>

        <button
          onClick={() => {
            router.push(`/auth/register?lang=${locale}`)
            setIsOpen(false)
          }}
          className="w-full text-left bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          {t.signup}
        </button>
      </div>
    </>
  )
}
