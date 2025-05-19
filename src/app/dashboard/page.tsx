'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<{ full_name: string } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user) {
        router.push('/auth/login')
        return
      }

      setUser(userData.user)

      const { data: profileData, error: profileError } = await supabase
        .from('api.profiles')
        .select('full_name')
        .eq('id', userData.user.id)
        .single()

      if (!profileError) {
        setProfile(profileData)
      }

      setLoading(false)
    }

    fetchUserAndProfile()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="loader border-blue-600 dark:border-blue-300" />
        <style jsx>{`
          .loader {
            border: 4px solid transparent;
            border-top-color: currentColor;
            border-radius: 9999px;
            width: 2rem;
            height: 2rem;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="flex justify-end px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {profile?.full_name || user?.email}
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 7l4.5 4 4.5-4H5.5z" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Hello {profile?.full_name || 'there'} 👋
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            You are now logged in as <strong>{user?.email}</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
