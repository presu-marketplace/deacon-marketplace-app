'use client'

import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { FiMail, FiLock } from 'react-icons/fi'

export type RegisterProps = {
  locale?: 'en' | 'es'
  t: {
    createAccount: string
    continueWithGoogle: string
    redirecting: string
    orSignupWithEmail: string
    email: string
    password: string
    registering: string
    register: string
    alreadyHaveAccount: string
    login: string
  }
}

const defaultT: RegisterProps['t'] = {
  createAccount: 'Create your PRESU account',
  continueWithGoogle: 'Sign up with Google',
  redirecting: 'Redirecting...',
  orSignupWithEmail: 'or sign up with email',
  email: 'Email',
  password: 'Password',
  registering: 'Registering...',
  register: 'Register',
  alreadyHaveAccount: 'Already have an account?',
  login: 'Log in'
}

export default function RegisterComponent({ t = defaultT }: RegisterProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = searchParams.get('lang') || 'es'
  // Added for flexibility, mirroring login
  const postAuthRedirect = searchParams.get('redirectTo') || '/'

  const handleRegister = async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: email.split('@')[0],
          locale: lang,
          avatar_url: '/images/user/user-placeholder.png'
        }
      }
    })

    if (!error && data?.user) {
      await fetch('/api/create-user-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: data.user.id })
      })
    }

    if (error) {
      setError(error.message)
    } else if (data?.user && !data?.session) {
      router.push(`/auth/login?check_email=true${lang ? `&lang=${lang}` : ''}`)
    } else {
      router.push(postAuthRedirect)
    }

    setLoading(false)
  }

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    // Dynamic OAuth redirectTo with ?next for final destination
    const oauthRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(postAuthRedirect)}${lang ? `&lang=${lang}` : ''}`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: oauthRedirectTo
      }
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6 border border-gray-700">
        <h2 className="text-2xl font-extrabold text-center text-white mb-2">
          {t.createAccount}
        </h2>
        <p className="text-sm text-center text-gray-400">
          {t.alreadyHaveAccount}{' '}
          <a
            href={`/auth/login${lang ? `?lang=${lang}` : ''}`}
            className="text-red-600 font-semibold hover:underline"
          >
            {t.login}
          </a>
        </p>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-2 bg-gray-700 text-white border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-600 transition disabled:opacity-50 text-sm font-medium"
          disabled={googleLoading}
        >
          {googleLoading && <span className="loader border-blue-500" />}
          {!googleLoading && <FcGoogle className="h-5 w-5" />}
          {googleLoading ? t.redirecting : t.continueWithGoogle}
        </button>

        {/* Divider */}
        <div className="relative text-center">
          <span className="text-xs text-gray-400 px-2 bg-gray-800 z-10 relative">
            {t.orSignupWithEmail}
          </span>
          <div className="absolute top-1/2 left-0 w-full border-t border-gray-600 -z-0 transform -translate-y-1/2" />
        </div>

        {/* Email input */}
        <div className="text-left">
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            {t.email}
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
        </div>

        {/* Password input */}
        <div className="text-left">
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            {t.password}
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Register button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold text-sm transition disabled:opacity-50 shadow"
        >
          {loading ? t.registering : t.register}
        </button>

        {/* Spinner CSS */}
        <style jsx>{`
          .loader {
            border: 2px solid transparent;
            border-top-color: currentColor;
            border-radius: 9999px;
            width: 1rem;
            height: 1rem;
            animation: spin 0.6s linear infinite;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
  )
}