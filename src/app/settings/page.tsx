'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { FiEdit2, FiCheckCircle } from 'react-icons/fi'
import Navbar from '@/components/layout/Navbar'
import { supabase } from '@/lib/supabaseClient'
import useUser from '@/features/auth/useUser'

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const langParam = searchParams.get('lang')
  const router = useRouter()

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
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return
      setAvatarUrl(user.user_metadata?.avatar_url || '')
      const { data } = await supabase
        .from('api.profiles')
        .select('full_name, phone, address, city')
        .eq('id', user.id)
        .single()
      setFullName(data?.full_name || user.user_metadata?.name || '')
      setPhone(data?.phone || user.user_metadata?.phone || '')
      setAddress(data?.address || user.user_metadata?.address || '')
      setCity(data?.city || user.user_metadata?.city || '')
    }
    loadProfile()
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    await supabase.auth.updateUser({
      data: { avatar_url: avatarUrl, name: fullName, phone, address, city },
    })
    await supabase.from('api.profiles').upsert({
      id: user.id,
      full_name: fullName,
      phone,
      address,
      city,
    })
    await supabase.auth.refreshSession()
    router.refresh()
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
      .from('users-data')
      .upload(filePath, file, { upsert: true })
    if (!error) {
      const publicPath = `/storage/v1/object/public/users-data/${filePath}`
      setAvatarUrl(publicPath)
      await supabase.auth.updateUser({ data: { avatar_url: publicPath } })
      await supabase.auth.refreshSession()
      router.refresh()
    } else {
      setAvatarUrl('/images/user/user-placeholder.png')
      await supabase.auth.updateUser({
        data: { avatar_url: '/images/user/user-placeholder.png' },
      })
      await supabase.auth.refreshSession()
      router.refresh()
    }
    setUploading(false)
  }

  const pageT = {
    personalInfo: locale === 'es' ? 'Información personal' : 'Personal info',
    photoHelp:
      locale === 'es'
        ? 'Una foto ayuda a personalizar tu cuenta.'
        : 'A photo helps personalize your account.',
    name: locale === 'es' ? 'Nombre' : 'Name',
    phone: locale === 'es' ? 'Teléfono' : 'Phone number',
    address: locale === 'es' ? 'Dirección' : 'Address',
    city: locale === 'es' ? 'Ciudad' : 'City',
    email: locale === 'es' ? 'Correo electrónico' : 'Email',
    verified: locale === 'es' ? 'Verificado' : 'Verified',
    update: locale === 'es' ? 'Actualizar' : 'Update',
    updating: locale === 'es' ? 'Actualizando...' : 'Updating...',
    placeholderName: locale === 'es' ? 'Tu nombre completo' : 'Your full name',
    placeholderPhone: '+549...',
    placeholderAddress: locale === 'es' ? 'Tu dirección' : 'Your address',
    placeholderCity: locale === 'es' ? 'Tu ciudad' : 'Your city',
    loading: locale === 'es' ? 'Cargando...' : 'Loading...',
  }

  if (!user)
    return (
      <>
        <Navbar locale={locale} toggleLocale={toggleLocale} t={t} forceWhite />
        <div className="bg-white min-h-screen pt-32">
          <div className="max-w-6xl mx-auto px-6 py-8">{pageT.loading}</div>
        </div>
      </>
    )

  return (
    <>
      <Navbar locale={locale} toggleLocale={toggleLocale} t={t} forceWhite />
      <div className="bg-white min-h-screen pt-32">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-6">
            {pageT.personalInfo}
          </h1>

          {/* Avatar row */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Image
                src={avatarUrl || '/images/user/user-placeholder.png'}
                alt="Avatar"
                width={64}
                height={64}
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
            <div>
              <div className="text-sm text-gray-900 font-medium">
                {fullName || pageT.placeholderName}
              </div>
              <div className="text-xs text-gray-500">{pageT.photoHelp}</div>
            </div>
          </div>

          {/* Settings list */}
          <div className="bg-white divide-y divide-gray-200">
            <Row
              label={pageT.name}
              rightEl={
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-0 py-2 border-0 bg-transparent focus:outline-none text-gray-900 placeholder:text-gray-400"
                  placeholder={pageT.placeholderName}
                />
              }
            />

            <Row
              label={pageT.phone}
              rightEl={
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 px-0 py-2 border-0 bg-transparent focus:outline-none"
                    placeholder={pageT.placeholderPhone}
                  />
                  {!!phone && (
                    <FiCheckCircle
                      className="text-green-600 shrink-0"
                      title={pageT.verified}
                    />
                  )}
                </div>
              }
            />

            <Row
              label={pageT.address}
              rightEl={
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-0 py-2 border-0 bg-transparent focus:outline-none"
                  placeholder={pageT.placeholderAddress}
                />
              }
            />

            <Row
              label={pageT.city}
              rightEl={
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-0 py-2 border-0 bg-transparent focus:outline-none"
                  placeholder={pageT.placeholderCity}
                />
              }
            />

            <Row
              label={pageT.email}
              rightEl={
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={user.email}
                    disabled
                    className="flex-1 px-0 py-2 border-0 bg-transparent text-gray-900"
                  />
                  <FiCheckCircle className="text-green-600 shrink-0" title={pageT.verified} />
                </div>
              }
            />

          </div>

          <div className="mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-black hover:bg-gray-800 disabled:opacity-60 text-white px-4 py-2 rounded-lg"
            >
              {saving ? pageT.updating : pageT.update}
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
    <div className="py-4 flex items-start sm:items-center gap-3">
      <div className="w-40 shrink-0 text-sm text-gray-900 font-medium">{label}</div>
      <div className="flex-1">{rightEl}</div>
      <div className="text-gray-400">{'›'}</div>
    </div>
  )
}
