'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useSearchParams } from 'next/navigation'

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
  login: 'Login'
}

export default function LoginComponent({ locale = 'en', t }: LoginComponentProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      router.push(redirectTo)
    }

    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback'
      }
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 space-y-6 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white">
          {t.loginTo} <span className="text-red-600">PRESU</span>
        </h2>

        {/* Google login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 shadow-sm"
          disabled={googleLoading}
        >
          {googleLoading && <span className="loader border-blue-500" />}
          {!googleLoading && (
            <img src="/google-icon.svg" alt="Google" className="h-5 w-5" />
          )}
          {googleLoading ? t.redirecting : t.continueWithGoogle}
        </button>

        {/* Divider */}
        <div className="relative text-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 px-4 bg-white dark:bg-gray-800 z-10 relative">
            {t.orLoginWithEmail}
          </span>
          <div className="absolute top-1/2 w-full border-t border-gray-200 dark:border-gray-700 left-0 transform -translate-y-1/2 z-0" />
        </div>

        {/* Email input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t.email}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        {/* Password input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t.password}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        {/* Forgot password */}
        <div className="text-right text-sm">
          <a
            href={`/auth/forgot-password?lang=${locale}`}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {t.forgotPassword}
          </a>
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 text-sm text-center">❌ {error}</p>}

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow"
        >
          {loading && <span className="loader border-white" />}
          {loading ? t.loggingIn : t.login}
        </button>
      </div>

      {/* Spinner style */}
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
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
