'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) setUser(data.user)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      router.refresh()
    })

    return () => subscription.unsubscribe()
  }, [router])

  useEffect(() => {
    const syncAvatar = async () => {
      if (user && !user.user_metadata?.avatar_url) {
        await supabase.auth.updateUser({
          data: { avatar_url: '/images/user/user-placeholder.png' },
        })
        await supabase.auth.refreshSession()
        router.refresh()
        return
      }
      if (
        user?.user_metadata?.avatar_url &&
        !user.user_metadata.avatar_url.startsWith('/storage/v1/object/public/users-data/') &&
        !user.user_metadata.avatar_url.startsWith('/images/')
      ) {
        try {
          const response = await fetch(user.user_metadata.avatar_url)
          const blob = await response.blob()
          const ext = blob.type.split('/')[1] || 'jpg'
          const filePath = `${user.id}/avatar.${ext}`
          const { error } = await supabase.storage
            .from('users-data')
            .upload(filePath, blob, { upsert: true })
          if (!error) {
            const publicPath = `/storage/v1/object/public/users-data/${filePath}`
            await supabase.auth.updateUser({ data: { avatar_url: publicPath } })
            await supabase.auth.refreshSession()
            router.refresh()
          } else {
            await supabase.auth.updateUser({
              data: { avatar_url: '/images/user/user-placeholder.png' },
            })
            await supabase.auth.refreshSession()
            router.refresh()
          }
        } catch (e) {
          console.error('Failed to sync avatar', e)
          await supabase.auth.updateUser({
            data: { avatar_url: '/images/user/user-placeholder.png' },
          })
          await supabase.auth.refreshSession()
          router.refresh()
        }
      }
    }
    syncAvatar()
  }, [user, router])

  return user
}
