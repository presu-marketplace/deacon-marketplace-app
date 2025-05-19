'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleResetPassword = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/auth/callback'
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('📩 Check your inbox for the password reset link.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
          Reset your password
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            placeholder="you@example.com"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">❌ {error}</p>}
        {success && <p className="text-green-600 text-sm mb-4 text-center">{success}</p>}

        <button
          onClick={handleResetPassword}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
        >
          {loading && <span className="loader border-white" />}
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Remembered your password?{' '}
          <a href="/auth/login" className="text-blue-600 hover:underline dark:text-blue-400">
            Go back to login
          </a>
        </div>
      </div>

      {/* Spinner Style */}
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
