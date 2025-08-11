'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

type Props = {
    user: User
    locale: 'en' | 'es'
}

export default function UserMenu({ user, locale }: Props) {
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [hasMouse, setHasMouse] = useState(false)
    const router = useRouter()

    const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || (locale === 'en' ? 'User' : 'Usuario')
    const avatarUrl = user?.user_metadata?.avatar_url || '/images/user/user-placeholder.png'

    const activityText = locale === 'en' ? 'Activity' : 'Actividad'
    const activityAlt = locale === 'en' ? 'Activity' : 'Actividad'

    const helpText = locale === 'en' ? 'Help' : 'Ayuda'
    const helpAlt = locale === 'en' ? 'Help' : 'Ayuda'

    const settingsText = locale === 'en' ? 'Settings' : 'Configuración'
    const settingsAlt = locale === 'en' ? 'Settings' : 'Configuración'

    const logoutText = locale === 'en' ? 'Log out' : 'Cerrar sesión'

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    useEffect(() => {
        const mediaQuery = window.matchMedia('(pointer: fine)')
        setHasMouse(mediaQuery.matches)

        const handleChange = (e: MediaQueryListEvent) => setHasMouse(e.matches)
        mediaQuery.addEventListener('change', handleChange)

        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [open])

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setOpen(true)
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setOpen(false)
        }, 200)
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => hasMouse ? setOpen(true) : setOpen(!open)}
                className="flex items-center gap-2 focus:outline-none px-3 py-1 hover:bg-gray-100 rounded-full transition"
                {...(hasMouse ? { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave } : {})}
            >
                <Image
                    src={avatarUrl}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
                <svg
                    className={`w-4 h-4 text-gray-600 transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                </svg>
            </button>

            <div
                className={`absolute right-0 mt-2 w-80 bg-white text-black rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden transition-all duration-200 transform ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                {...(hasMouse ? { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave } : {})}
            >
                {/* User Info */}
                <div className="p-5 flex items-center gap-4">
                    <Image
                        src={avatarUrl}
                        alt="User"
                        width={56}
                        height={56}
                        className="rounded-full"
                    />
                    <div>
                        <p className="font-semibold text-xl leading-tight">{userName}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                </div>

                {/* Icons: Activity + Help */}
                <div className="grid grid-cols-2 px-5 pb-3 gap-4">
                    <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition transform hover:scale-105">
                        <Image src="/images/user/user-activity.png" alt={activityAlt} width={28} height={28} />
                        <span className="text-sm mt-1 font-semibold">{activityText}</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition transform hover:scale-105">
                        <Image src="/images/user/user-help.png" alt={helpAlt} width={28} height={28} />
                        <span className="text-sm mt-1 font-semibold">{helpText}</span>
                    </button>
                </div>

                {/* Settings - Centered */}
                <div className="px-5 pt-3">
                    <Link
                        href="/settings"
                        onClick={() => setOpen(false)}
                        className="flex flex-col items-center justify-center hover:bg-gray-100 rounded-xl transition transform hover:scale-105 py-4"
                    >
                        <Image src="/images/user/user-settings.png" alt={settingsAlt} width={28} height={28} />
                        <span className="text-sm font-semibold mt-1">{settingsText}</span>
                    </Link>
                </div>

                {/* Logout */}
                <div className="px-5 pt-6 pb-5"> {/* slightly more space above */}
                    <button
                        onClick={handleLogout}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-red-600 font-bold text-sm py-3 rounded-xl transition transform hover:scale-[1.02]"
                    >
                        {logoutText}
                    </button>
                </div>
            </div>
        </div>
    )
}