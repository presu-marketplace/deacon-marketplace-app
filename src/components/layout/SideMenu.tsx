'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import useUser from '@/features/auth/useUser'

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
  forceWhite = false,
}: SideMenuProps) {
  const router = useRouter()
  const user = useUser()
  const [mounted, setMounted] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('/images/user/user-placeholder.png')

  useEffect(() => setMounted(true), [])

  const userName = user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    (locale === 'es' ? 'Usuario' : 'User')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

  useEffect(() => {
    const loadAvatar = async () => {
      const raw = user?.user_metadata?.avatar_url
      if (!raw) {
        setAvatarUrl('/images/user/user-placeholder.png')
        return
      }
      if (raw.startsWith('/images/')) {
        setAvatarUrl(raw)
        return
      }
      if (raw.startsWith('http') && !raw.includes('/storage/v1/object/')) {
        setAvatarUrl(raw)
        return
      }
      let path = raw
      const publicPrefix = `/storage/v1/object/public/users-data/`
      const fullPublicPrefix = `${supabaseUrl}${publicPrefix}`
      if (path.startsWith(fullPublicPrefix)) {
        path = path.slice(fullPublicPrefix.length)
      } else if (path.startsWith(publicPrefix)) {
        path = path.slice(publicPrefix.length)
      }
      const { data } = await supabase.storage
        .from('users-data')
        .createSignedUrl(path, 60 * 60)
      setAvatarUrl(data?.signedUrl || '/images/user/user-placeholder.png')
    }
    if (user) loadAvatar()
  }, [user, supabaseUrl])

  const providerLabel =
    locale === 'es' ? 'Quiero ser proveedor' : 'Join as a provider'

  const activityText = locale === 'es' ? 'Actividad' : 'Activity'
  const activityAlt = activityText

  const helpText = locale === 'es' ? 'Ayuda' : 'Help'
  const helpAlt = helpText

  const settingsText = locale === 'es' ? 'Configuración' : 'Settings'
  const settingsAlt = settingsText

  const logoutText = locale === 'es' ? 'Cerrar sesión' : 'Log out'

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const wrapperClasses = `
    fixed inset-y-0 left-0 w-[85%] max-w-xs z-50 transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    ${forceWhite ? 'bg-white text-black' : 'bg-white dark:bg-black text-black dark:text-white'}
  `

  const loginButtonClasses = forceWhite
    ? 'bg-gray-100 text-black'
    : 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'

  if (!mounted || user === undefined) return null

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

          {/* Main Content */}
          {user ? (
            <>
              <div className="flex items-center gap-4 px-4 pt-2">
                <Image
                  src={avatarUrl}
                  alt="User Avatar"
                  width={56}
                  height={56}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-lg leading-tight">{userName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <ul className="px-4 pt-6 font-semibold">
                <li>
                  <button
                    onClick={() => {
                      router.push(`/auth/register?role=pro&lang=${locale}`)
                      onClose()
                    }}
                    className="w-full text-center text-base py-2"
                  >
                    {providerLabel}
                  </button>
                </li>
              </ul>
              {/* Mobile user actions */}
              <ul className="md:hidden px-4 pt-6 flex flex-col gap-2">
                <li>
                  <Link
                    href="/activity"
                    onClick={onClose}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <Image
                      src="/images/user/user-activity.png"
                      alt={activityAlt}
                      width={20}
                      height={20}
                    />
                    <span className="text-sm font-semibold">{activityText}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    onClick={onClose}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <Image
                      src="/images/user/user-help.png"
                      alt={helpAlt}
                      width={20}
                      height={20}
                    />
                    <span className="text-sm font-semibold">{helpText}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    onClick={onClose}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <Image
                      src="/images/user/user-settings.png"
                      alt={settingsAlt}
                      width={20}
                      height={20}
                    />
                    <span className="text-sm font-semibold">{settingsText}</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={async () => {
                      await handleLogout()
                      onClose()
                    }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 text-red-600 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                      />
                    </svg>
                    <span className="text-sm font-semibold">{logoutText}</span>
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <>
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
              <ul className="px-4 pt-6 font-semibold">
                <li>
                  <button
                    onClick={() => {
                      router.push(`/auth/register?role=pro&lang=${locale}`)
                      onClose()
                    }}
                    className="w-full text-center text-base py-2"
                  >
                    {providerLabel}
                  </button>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  )
}