'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const recover = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (data.session) {
        const role = searchParams.get('role') || undefined
        const nextParam = searchParams.get('next')
        const next = nextParam ? decodeURIComponent(nextParam) : '/'
        const fullName =
          data.session.user.user_metadata?.full_name ||
          data.session.user.user_metadata?.name

        await fetch('/api/create-user-folder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: data.session.user.id,
            role,
            fullName,
          }),
        })
        router.push(next)
      } else {
        console.error('Recovery failed:', error?.message)
        router.push('/auth/login')
      }
    }

    recover()
  }, [router, searchParams])

  return <div className="p-6 text-center text-gray-200">Restaurando sesión...</div>
}
