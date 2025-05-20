'use client'

import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X } from '@phosphor-icons/react'
import { FcGoogle } from 'react-icons/fc'

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

export default function RegisterComponent({ locale = 'en', t = defaultT }: RegisterProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = searchParams.get('lang')

  const handleRegister = async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: email.split('@')[0] }
      }
    })

    if (error) {
      setError(error.message)
    } else if (data?.user && !data?.session) {
      router.push(`/auth/login?check_email=true${lang ? `&lang=${lang}` : ''}`)
    } else {
      router.push('/dashboard')
    }

    setLoading(false)
  }

  const handleGoogleSignup = async () => {
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
          {t.createAccount}
        </h2>
        <p className="text-sm text-gray-400">
          {t.alreadyHaveAccount}{' '}
          <a
            href={`/auth/login${lang ? `?lang=${lang}` : ''}`}
            className="text-red-500 font-semibold hover:underline"
          >
            {t.login}
          </a>
        </p>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-2 bg-white text-black border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition disabled:opacity-50 text-sm"
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
        <div>
          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
        </div>

        {/* Password input */}
        <div>
          <input
            type="password"
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Register button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold text-sm transition disabled:opacity-50"
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
    </div>
  )
}
