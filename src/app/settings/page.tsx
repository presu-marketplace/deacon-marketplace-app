'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import useUser from '@/features/auth/useUser'

export default function SettingsPage() {
  const user = useUser()
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return
      setAvatarUrl(user.user_metadata?.avatar_url || '')
      const { data } = await supabase
        .from('api.profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()
      if (data?.full_name) setFullName(data.full_name)
    }
    loadProfile()
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    await supabase.auth.updateUser({ data: { full_name: fullName, avatar_url: avatarUrl } })
    await supabase.from('api.profiles').upsert({ id: user.id, full_name: fullName })
    setSaving(false)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const filePath = `${user.id}/avatar.${ext}`
    const { error } = await supabase.storage.from('user-uploads').upload(filePath, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('user-uploads').getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)
      await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } })
    }
    setUploading(false)
  }

  if (!user) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Image
            src={avatarUrl || '/images/user/user-placeholder.png'}
            alt="Avatar"
            width={80}
            height={80}
            className="rounded-full"
          />
          <div>
            <label className="block text-sm font-medium mb-1">Photo</label>
            <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="text"
            value={user.email}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="self-start bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
