'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const recover = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (data.session) {
        await fetch('/api/create-user-folder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: data.session.user.id })
        })
        router.push('/')
      } else {
        console.error('Recovery failed:', error?.message)
        router.push('/auth/login')
      }
    }

    recover()
  }, [router])

  return <div className="p-6 text-center text-gray-200">Restaurando sesión...</div>
}
