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
      const bucket = 'users-data'
      const placeholderPath = `${user?.id}/user-placeholder.png`

      if (user && !user.user_metadata?.avatar_url) {
        const { data } = supabase.storage
          .from(bucket)
          .getPublicUrl(placeholderPath)
        const avatarUrl = data?.publicUrl || '/images/user/user-placeholder.png'
        await supabase.auth.updateUser({ data: { avatar_url: avatarUrl } })
        await supabase.auth.refreshSession()
        router.refresh()
        return
      }

      if (
        user?.user_metadata?.avatar_url &&
        !user.user_metadata.avatar_url.includes('/storage/v1/object/public/users-data/') &&
        !user.user_metadata.avatar_url.startsWith('/images/')
      ) {
        try {
          const response = await fetch(user.user_metadata.avatar_url)
          const blob = await response.blob()
          const ext = blob.type.split('/')[1] || 'jpg'
          const filePath = `${user.id}/avatar.${ext}`
          const { error } = await supabase.storage
            .from(bucket)
            .upload(filePath, blob, { upsert: true })

          const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath)
          const publicUrl = data?.publicUrl

          if (!error && publicUrl) {
            await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })
          } else {
            const { data: placeholder } = supabase.storage
              .from(bucket)
              .getPublicUrl(placeholderPath)
            await supabase.auth.updateUser({ data: { avatar_url: placeholder?.publicUrl } })
          }

          await supabase.auth.refreshSession()
          router.refresh()
        } catch (e) {
          console.error('Failed to sync avatar', e)
          const { data: placeholder } = supabase.storage
            .from(bucket)
            .getPublicUrl(placeholderPath)
          await supabase.auth.updateUser({ data: { avatar_url: placeholder?.publicUrl } })
          await supabase.auth.refreshSession()
          router.refresh()
        }
      }
    }
    syncAvatar()
  }, [user, router])

  return user
}
