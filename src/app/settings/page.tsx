'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { FiEdit2 } from 'react-icons/fi'
import { supabase } from '@/lib/supabaseClient'
import useUser from '@/features/auth/useUser'

export default function SettingsPage() {
  const user = useUser()
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return
      setAvatarUrl(user.user_metadata?.avatar_url || '')
      setPhone(user.user_metadata?.phone || '')
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
    await supabase.auth.updateUser({ data: { full_name: fullName, avatar_url: avatarUrl, phone } })
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
      <h1 className="text-2xl font-bold mb-6">Personal info</h1>
      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Image
              src={avatarUrl || '/images/user/user-placeholder.png'}
              alt="Avatar"
              width={96}
              height={96}
              className="rounded-full object-cover"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500">Photo</p>
            <p className="text-xs text-gray-400">A photo helps personalize your account.</p>
          </div>
        </div>
        <div className="space-y-4">
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
            <label className="block text-sm font-medium mb-1">Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
