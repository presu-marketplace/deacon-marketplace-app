'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useSearchParams } from 'next/navigation'
import { X } from '@phosphor-icons/react'
import { FcGoogle } from 'react-icons/fc'

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

export default function LoginComponent({ locale = 'en', t = defaultT }: LoginComponentProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  const lang = searchParams.get('lang') || locale

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white relative px-4">
      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-white hover:text-gray-300"
        onClick={() => router.push('/')}
        aria-label="Close"
      >
        <X size={20} weight="bold" />
      </button>

      <div className="w-full max-w-sm bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 border border-gray-700 text-center">
        <h2 className="text-3xl font-handwritten font-medium tracking-widest mb-6">
          {t.loginTo}
        </h2>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white text-black border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition disabled:opacity-50 text-sm"
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

        <div>
          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
        </div>

        <div>
          <input
            type="password"
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
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
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold text-sm transition disabled:opacity-50"
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
    </div>
  )
}