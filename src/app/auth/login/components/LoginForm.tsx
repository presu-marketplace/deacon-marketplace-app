'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useSearchParams } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { FiMail, FiLock } from 'react-icons/fi'

type LoginComponentProps = {
  locale?: 'en' | 'es'
  t: {
    loginTo: string
    continueWithGoogle: string
    redirecting: string
    orLoginWithEmail: string
    email: string
    password: string
    forgotPassword: string
    loggingIn: string
    login: string
    noAccount: string
    register: string
  }
}

const defaultT: LoginComponentProps['t'] = {
  loginTo: 'Login to',
  continueWithGoogle: 'Continue with Google',
  redirecting: 'Redirecting...',
  orLoginWithEmail: 'or login with email',
  email: 'Email',
  password: 'Password',
  forgotPassword: 'Forgot your password?',
  loggingIn: 'Logging in...',
  login: 'Login',
  noAccount: "Don't have an account?",
  register: 'Sign up'
}

export default function LoginComponent({ locale = 'en', t = defaultT }: LoginComponentProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const postAuthRedirect = searchParams.get('redirectTo') || '/'  // Renamed for clarity; used after successful login
  const lang = searchParams.get('lang') || locale

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      router.push(postAuthRedirect)
    }

    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    // Always redirect OAuth to /auth/callback, with ?next for final destination
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
          {t.loginTo}
        </h2>
        <p className="text-sm text-center text-gray-400">
          {t.noAccount}{' '}
          <a
            href={`/auth/register?lang=${lang}`}
            className="text-red-600 font-semibold hover:underline"
          >
            {t.register}
          </a>
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-gray-700 text-white border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-600 transition disabled:opacity-50 text-sm font-medium"
          disabled={googleLoading}
        >
          {googleLoading && <span className="loader border-blue-500" />}
          {!googleLoading && <FcGoogle className="h-5 w-5" />}
          {googleLoading ? t.redirecting : t.continueWithGoogle}
        </button>

        <div className="relative text-center">
          <span className="text-xs text-gray-400 px-2 bg-gray-800 z-10 relative">
            {t.orLoginWithEmail}
          </span>
          <div className="absolute top-1/2 left-0 w-full border-t border-gray-600 -z-0 transform -translate-y-1/2" />
        </div>

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

        <div className="text-right text-sm">
          <a
            href={`/auth/forgot-password?lang=${lang}`}
            className="text-red-500 hover:underline"
          >
            {t.forgotPassword}
          </a>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold text-sm transition disabled:opacity-50 shadow"
        >
          {loading ? t.loggingIn : t.login}
        </button>

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