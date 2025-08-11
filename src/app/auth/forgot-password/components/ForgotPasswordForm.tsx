'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { FiMail } from 'react-icons/fi'

type ForgotPasswordProps = {
  locale?: 'en' | 'es'
  t?: {
    title: string
    description: string
    email: string
    sending: string
    sendResetLink: string
    success: string
    loginRedirect: string
    backToLogin: string
  }
}

const defaultT: ForgotPasswordProps['t'] = {
  title: 'Reset your password',
  description: "Enter your email and we'll send you a link to reset your password.",
  email: 'Email',
  sending: 'Sending...',
  sendResetLink: 'Send Reset Link',
  success: '📩 Check your inbox for the password reset link.',
  loginRedirect: 'Remembered your password?',
  backToLogin: 'Go back to login'
}

export default function ForgotPasswordComponent({
    locale = 'en',
    t = defaultT as NonNullable<ForgotPasswordProps['t']>
  }: ForgotPasswordProps) {
  const mergedT = { ...defaultT, ...t }

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleResetPassword = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?lang=${locale}`
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(t?.success ?? mergedT.success)
    }

    setLoading(false)
  }

  return (
    <div className="w-full max-w-md bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-700 text-white">
        <h2 className="text-2xl font-extrabold text-center text-white mb-6">
          {t?.title}
        </h2>

        <p className="text-sm text-gray-400 text-center mb-6">
          {t?.description}
        </p>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            {t?.email}
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">❌ {error}</p>}
        {success && <p className="text-green-400 text-sm mb-4 text-center">{success}</p>}

        <button
          onClick={handleResetPassword}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
        >
          {loading && <span className="loader border-white" />}
          {loading ? t?.sending : t?.sendResetLink}
        </button>

        <div className="text-center text-sm text-gray-400 mt-6">
          {t?.loginRedirect}{' '}
          <a href={`/auth/login?lang=${locale}`} className="text-blue-400 hover:underline">
            {t?.backToLogin}
          </a>
        </div>
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