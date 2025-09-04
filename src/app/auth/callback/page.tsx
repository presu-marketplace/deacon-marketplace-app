'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const recover = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const role = urlParams.get('role') || undefined
      const nextParam = urlParams.get('next')
      const next = nextParam ? decodeURIComponent(nextParam) : '/'

      const { data, error } = await supabase.auth.getSession()
      if (data.session) {
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

        // Remove tokens and auth params from URL after session is stored
        const params = new URLSearchParams(window.location.search)
        params.delete('code')
        params.delete('state')
        window.history.replaceState(
          {},
          document.title,
          `${window.location.pathname}${
            params.toString() ? `?${params.toString()}` : ''
          }`
        )

        if (/^https?:\/\//.test(next)) {
          window.location.href = next
        } else {
          router.push(next)
        }
      } else {
        console.error('Recovery failed:', error?.message)
        router.push('/auth/login')
      }
    }

    recover()
  }, [router])

  return <div className="p-6 text-center text-gray-200">Restaurando sesión...</div>
}
