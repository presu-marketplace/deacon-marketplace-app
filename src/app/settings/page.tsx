'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { FiEdit2, FiCheckCircle, FiExternalLink } from 'react-icons/fi'
import Navbar from '@/components/layout/Navbar'
import { supabase } from '@/lib/supabaseClient'
import useUser from '@/features/auth/useUser'

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const langParam = searchParams.get('lang')

  const [locale, setLocale] = useState<'en' | 'es'>('en')
  useEffect(() => {
    if (langParam === 'es' || langParam === 'en') {
      setLocale(langParam)
    } else {
      const browserLang = navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
      setLocale(browserLang)
    }
  }, [langParam])

  const toggleLocale = () => {
    const newLocale = locale === 'es' ? 'en' : 'es'
    setLocale(newLocale)
    const currentPath = window.location.pathname
    window.location.href = `${currentPath}?lang=${newLocale}`
  }

  const t = {
    howItWorks: locale === 'es' ? 'Cómo funciona' : 'How it works',
    login: locale === 'es' ? 'Iniciar sesión' : 'Log In',
    signup: locale === 'es' ? 'Crear cuenta' : 'Sign Up',
    searchPlaceholder: locale === 'es' ? 'Buscar servicio...' : 'Search service...',
    language: locale === 'es' ? 'Español' : 'English',
    joinAsPro: locale === 'es' ? 'Unirse como proveedor' : 'Join as provider',
  }

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
    const { error } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('user-uploads').getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)
      await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } })
    }
    setUploading(false)
  }

  if (!user)
    return (
      <>
        <Navbar locale={locale} toggleLocale={toggleLocale} t={t} forceWhite />
        <div className="max-w-6xl mx-auto px-6 py-8 pt-32">Loading...</div>
      </>
    )

  return (
    <>
      <Navbar locale={locale} toggleLocale={toggleLocale} t={t} forceWhite />
      <div className="max-w-6xl mx-auto px-6 py-8 pt-32">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Personal info</h1>

        <div className="bg-white rounded-2xl shadow-sm border">
          <div className="p-6 flex items-center gap-6">
            <div className="relative">
              <Image
                src={avatarUrl || '/images/user/user-placeholder.png'}
                alt="Avatar"
                width={96}
                height={96}
                className="rounded-full object-cover ring-1 ring-black/5"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800"
                title="Change photo"
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
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Photo</p>
              <p className="text-xs text-gray-400">A photo helps personalize your account.</p>
            </div>
          </div>

          <hr className="border-t" />

          <div className="divide-y">
            <Row
              label="Name"
              rightEl={
                <div className="w-full sm:w-[560px]">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Your full name"
                  />
                </div>
              }
            />

            <Row
              label="Phone number"
              rightEl={
                <div className="flex items-center gap-3 w-full sm:w-[560px]">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2"
                    placeholder="+549..."
                  />
                  {!!phone && (
                    <FiCheckCircle className="text-green-600 shrink-0" title="Verified" />
                  )}
                </div>
              }
            />

            <Row
              label="Email"
              rightEl={
                <div className="flex items-center gap-3 w-full sm:w-[560px]">
                  <input
                    type="text"
                    value={user.email}
                    disabled
                    className="flex-1 border rounded-lg px-3 py-2 bg-gray-100"
                  />
                  <FiCheckCircle className="text-green-600 shrink-0" title="Verified" />
                </div>
              }
            />

            <Row
              label="Language"
              rightEl={
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm text-gray-700 hover:underline"
                  onClick={() => window.open('/device-language', '_blank')}
                >
                  Update device language
                  <FiExternalLink className="w-4 h-4" />
                </button>
              }
            />
          </div>

          <div className="p-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function Row({
  label,
  rightEl,
}: {
  label: string
  rightEl: React.ReactNode
}) {
  return (
    <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
      <div className="w-40 shrink-0 text-sm text-gray-500">{label}</div>
      <div className="flex-1">{rightEl}</div>
      <div className="hidden sm:block text-gray-400">{'›'}</div>
    </div>
  )
}

