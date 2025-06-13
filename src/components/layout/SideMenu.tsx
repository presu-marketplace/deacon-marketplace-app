'use client'

import { useRouter } from 'next/navigation'

type SideMenuProps = {
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
  forceWhite?: boolean
}

export default function SideMenu({
  isOpen,
  onClose,
  locale,
  t,
  toggleLocale,
  forceWhite = false,
}: SideMenuProps) {
  const router = useRouter()

  const providerLabel =
    locale === 'es' ? 'Crear una cuenta de proveedor' : 'Create a provider account'

  const wrapperClasses = `
    fixed inset-y-0 left-0 w-[85%] max-w-xs z-50 transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    ${forceWhite ? 'bg-white text-black' : 'bg-white dark:bg-black text-black dark:text-white'}
  `

  const loginButtonClasses = forceWhite
    ? 'bg-gray-100 text-black'
    : 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'

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
      <div className={wrapperClasses}>
        <div className="flex flex-col h-full p-[0.875rem] gap-4">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="self-end text-2xl"
            aria-label="Close Menu"
          >
            ✕
          </button>

          {/* Main Actions */}
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
            className={`${loginButtonClasses} font-semibold rounded-lg py-3`}
          >
            {t.login}
          </button>

          {/* Additional Options */}
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
        </div>
      </div>
    </>
  )
}
