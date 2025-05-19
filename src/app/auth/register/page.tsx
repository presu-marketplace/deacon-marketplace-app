'use client'
import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

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
      // Email confirmation is enabled, can't auto-login
      router.push('/auth/login?check_email=true')
    } else {
      // Auto-login
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
          Create your PRESU account
        </h2>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition mb-6 disabled:opacity-50 shadow-sm"
          disabled={googleLoading}
        >
          {googleLoading && <span className="loader border-blue-500" />}
          {!googleLoading && (
            <img src="/google-icon.svg" alt="Google" className="h-5 w-5" />
          )}
          {googleLoading ? 'Redirecting...' : 'Sign up with Google'}
        </button>

        {/* Divider */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          — or sign up with email —
        </div>

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

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">❌ {error}</p>}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
        >
          {loading && <span className="loader border-white" />}
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <a href="/auth/login" className="text-blue-600 hover:underline dark:text-blue-400">
            Log in
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
