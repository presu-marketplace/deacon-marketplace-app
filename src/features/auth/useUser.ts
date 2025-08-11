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
      if (!user) return
      const bucket = 'users-data'
      const placeholderUrl = '/images/user/user-placeholder.png'
      const url = user.user_metadata?.avatar_url

      if (!url) {
        await supabase.auth.updateUser({ data: { avatar_url: placeholderUrl } })
        await supabase.auth.refreshSession()
        const { data: fresh } = await supabase.auth.getUser()
        if (fresh?.user) setUser(fresh.user)
        router.refresh()
        return
      }

      const publicPrefix = `/storage/v1/object/public/${bucket}/`
      const fullPublicPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}${publicPrefix}`
      if (url.startsWith(fullPublicPrefix) || url.startsWith(publicPrefix)) {
        const filePath = url.startsWith(fullPublicPrefix)
          ? url.slice(fullPublicPrefix.length)
          : url.slice(publicPrefix.length)
        await supabase.auth.updateUser({ data: { avatar_url: filePath } })
        await supabase.auth.refreshSession()
        const { data: fresh } = await supabase.auth.getUser()
        if (fresh?.user) setUser(fresh.user)
        router.refresh()
        return
      }

      if (url.startsWith('/images/') || (!url.startsWith('http') && !url.startsWith('/storage/'))) {
        return
      }

      try {
        const response = await fetch(url)
        const blob = await response.blob()
        const ext = blob.type.split('/')[1] || 'jpg'
        const filePath = `${user.id}/avatar.${ext}`
        const { error } = await supabase.storage
          .from(bucket)
          .upload(filePath, blob, { upsert: true })
        if (!error) {
          await supabase.auth.updateUser({ data: { avatar_url: filePath } })
        } else {
          await supabase.auth.updateUser({ data: { avatar_url: placeholderUrl } })
        }
      } catch (e) {
        console.error('Failed to sync avatar', e)
        await supabase.auth.updateUser({ data: { avatar_url: placeholderUrl } })
      }
      await supabase.auth.refreshSession()
      const { data: fresh } = await supabase.auth.getUser()
      if (fresh?.user) setUser(fresh.user)
      router.refresh()
    }
    syncAvatar()
  }, [user, router])

  return user
}
