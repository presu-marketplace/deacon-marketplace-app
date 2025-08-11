'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { FiEdit2, FiCheckCircle, FiChevronRight } from 'react-icons/fi'
import Navbar from '@/components/layout/Navbar'
import { supabase } from '@/lib/supabaseClient'
import useUser from '@/features/auth/useUser'

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const langParam = searchParams.get('lang')
  const router = useRouter()

  const [locale, setLocale] = useState<'en' | 'es'>('en')
  useEffect(() => {
    if (langParam === 'es' || langParam === 'en') setLocale(langParam)
    else setLocale(navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en')
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
  const [avatarPath, setAvatarPath] = useState('')
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
      setAvatarPath(user.user_metadata?.avatar_url || '')
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

  useEffect(() => {
    const loadAvatar = async () => {
      if (!avatarPath) {
        setAvatarUrl('')
        return
      }
      if (avatarPath.startsWith('/images/')) {
        setAvatarUrl(avatarPath)
        return
      }
      const { data } = await supabase.storage
        .from('users-data')
        .createSignedUrl(avatarPath, 60 * 60)
      setAvatarUrl(data?.signedUrl || '/images/user/user-placeholder.png')
    }
    loadAvatar()
  }, [avatarPath])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    await supabase.auth.updateUser({
      data: { avatar_url: avatarPath, name: fullName, phone, address, city },
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
      setAvatarPath(filePath)
      const { data } = await supabase.storage
        .from('users-data')
        .createSignedUrl(filePath, 60 * 60)
      setAvatarUrl(data?.signedUrl || '/images/user/user-placeholder.png')
      await supabase.auth.updateUser({ data: { avatar_url: filePath } })
    } else {
      const placeholder = '/images/user/user-placeholder.png'
      setAvatarPath(placeholder)
      setAvatarUrl(placeholder)
      await supabase.auth.updateUser({ data: { avatar_url: placeholder } })
    }
    await supabase.auth.refreshSession()
    router.refresh()
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

          {/* Avatar block */}
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
              <div className="text-sm text-gray-900 font-medium">{fullName}</div>
              <div className="text-xs text-gray-500">
                {pageT.photoHelp}
              </div>
            </div>
          </div>

          {/* Settings list (display style) */}
          <div className="bg-white divide-y divide-gray-200">
            <Row label={pageT.name} value={fullName} />
            <Row
              label={pageT.phone}
              value={
                <span className="inline-flex items-center gap-2">
                  {phone}
                  {!!phone && <FiCheckCircle className="text-green-600" title={pageT.verified} />}
                </span>
              }
            />
            <Row
              label={pageT.email}
              value={
                <span className="inline-flex items-center gap-2">
                  {user.email}
                  <FiCheckCircle className="text-green-600" title={pageT.verified} />
                </span>
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
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="py-4 flex items-center justify-between">
      <div className="flex-1">
        <div className="text-sm font-semibold text-gray-900">{label}</div>
        <div className="mt-1 text-sm text-gray-700">{value}</div>
      </div>
      <FiChevronRight className="text-gray-400 shrink-0" aria-hidden />
    </div>
  )
}
