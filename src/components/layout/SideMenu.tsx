'use client'

import { useRouter } from 'next/navigation'

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
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
}

export default function MobileMenu({ isOpen, onClose, locale, t }: MobileMenuProps) {
  const router = useRouter()

  const providerLabel =
    locale === 'es' ? 'Crear una cuenta de proveedor' : 'Create a provider account'

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40"
          aria-hidden="true"
        />
      )}

      {/* Slide-out Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-[85%] max-w-xs bg-white dark:bg-black z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-[0.875rem] gap-4">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="self-end text-2xl"
            aria-label="Close Menu"
          >
            ✕
          </button>

          {/* Main Actions: Sign Up / Log In */}
          <button
            onClick={() => {
              router.push(`/auth/register?lang=${locale}`)
              onClose()
            }}
            className="bg-black text-white font-semibold rounded-lg py-3"
          >
            {t.signup}
          </button>
          <button
            onClick={() => {
              router.push(`/auth/login?lang=${locale}`)
              onClose()
            }}
            className="bg-gray-100 text-black font-semibold rounded-lg py-3"
          >
            {t.login}
          </button>

          {/* Additional Links */}
          <ul className="text-sm space-y-4 mt-2">
            <li>
              <button
                onClick={() => {
                  router.push(`/auth/register?role=pro&lang=${locale}`)
                  onClose()
                }}
                className="w-full text-left"
              >
                {providerLabel}
              </button>
            </li>
          </ul>

          {/* App download area
          <div className="mt-auto pt-12">
            <div className="flex items-center gap-4">
              <Image src="/logo/presu-logo.png" alt="Presu Logo" width={40} height={40} />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                There’s more to love in the app.
              </p>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full flex items-center gap-2 text-sm">
                <i className="fab fa-apple" /> iPhone
              </button>
              <button className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full flex items-center gap-2 text-sm">
                <i className="fab fa-android" /> Android
              </button>
            </div>
          </div> */}
          
        </div>
      </div>
    </>
  )
}
