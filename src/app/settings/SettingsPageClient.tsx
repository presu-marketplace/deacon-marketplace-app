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
  const [phoneValid, setPhoneValid] = useState(true)
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [role, setRole] = useState<'client' | 'provider' | 'admin'>('client')
  const [companyName, setCompanyName] = useState('')
  const [taxId, setTaxId] = useState('')
  const [services, setServices] = useState<{ id: string; name_en: string; name_es: string }[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '')
    return digits ? `+${digits}` : ''
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setPhone(formatted)
    setPhoneValid(!formatted || /^\+[1-9]\d{1,14}$/.test(formatted))
  }

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return
      setAvatarPath(user.user_metadata?.avatar_url || '')
      const { data } = await supabase
        .from('profiles')
        .select('full_name, phone, address, city, role')
        .eq('id', user.id)
        .single()
      setFullName(data?.full_name || user.user_metadata?.name || '')
      const initialPhone = formatPhone(data?.phone || user.user_metadata?.phone || '')
      setPhone(initialPhone)
      setPhoneValid(!initialPhone || /^\+[1-9]\d{1,14}$/.test(initialPhone))
      setAddress(data?.address || user.user_metadata?.address || '')
      setCity(data?.city || user.user_metadata?.city || '')
      setRole((data?.role as 'client' | 'provider' | 'admin') || 'client')
      if (data?.role === 'provider') {
        const { data: provider } = await supabase
          .from('providers')
          .select('company_name, tax_id, coverage_area')
          .eq('user_id', user.id)
          .single()
        setCompanyName(provider?.company_name || '')
        setTaxId(provider?.tax_id || '')
        const { data: providerServices } = await supabase
          .from('provider_services')
          .select('service_id')
          .eq('provider_id', user.id)
        setSelectedServices(providerServices?.map((ps: { service_id: string }) => ps.service_id) || [])
        const { data: allServices } = await supabase
          .from('services')
          .select('id, name_en, name_es')
        const sorted = (allServices || []).sort((a, b) => {
          const aName = locale === 'es' ? a.name_es : a.name_en
          const bName = locale === 'es' ? b.name_es : b.name_en
          return aName.localeCompare(bName)
        })
        setServices(sorted)
      }
    }
    loadProfile()
  }, [user, locale])

  useEffect(() => {
    const fillCity = async () => {
      if (city) return
      if (!('geolocation' in navigator) || !('permissions' in navigator)) return
      try {
        const status = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
        if (status.state === 'granted') {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
              const { latitude, longitude } = pos.coords
              const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${locale === 'es' ? 'es' : 'en'}`)
              const data = await res.json()
              const cityName = data.city || data.locality || ''
              const stateName = data.principalSubdivision || ''
              if (cityName && stateName) setCity(`${cityName}, ${stateName}`)
            } catch {
              // ignore errors
            }
          })
        }
      } catch {
        // ignore errors
      }
    }
    fillCity()
  }, [city, locale])

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
    if (!phoneValid) return
    setSaving(true)

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      console.error('No Supabase session; user must be authenticated')
      setSaving(false)
      return
    }

    const { error: authErr } = await supabase.auth.updateUser({
      data: { avatar_url: avatarPath, name: fullName, phone, address, city },
    })
    if (authErr) {
      console.error('Failed to update auth user', authErr)
      setSaving(false)
      return
    }

    const { error: profileErr } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: fullName,
      phone,
      address,
      city,
      role,
    })
    if (profileErr) {
      console.error('Failed to upsert profile', profileErr)
      setSaving(false)
      return
    }

    if (role === 'provider') {
      const { error: providerErr } = await supabase.from('providers').upsert({
        user_id: user.id,
        company_name: companyName,
        tax_id: taxId,
        coverage_area: city ? [city] : [],
      })
      if (providerErr) {
        console.error('Failed to upsert provider', providerErr)
        setSaving(false)
        return
      }
      const { error: delErr } = await supabase
        .from('provider_services')
        .delete()
        .eq('provider_id', user.id)
      if (delErr) {
        console.error('Failed to clear provider services', delErr)
        setSaving(false)
        return
      }
      if (selectedServices.length > 0) {
        const uniqueServices = Array.from(new Set(selectedServices))
        const rows = uniqueServices.map((service_id) => ({
          provider_id: user.id,
          service_id,
        }))
        const { error: insertErr } = await supabase
          .from('provider_services')
          .insert(rows)
        if (insertErr) {
          console.error('Failed to insert provider services', insertErr)
          setSaving(false)
          return
        }
      }
    } else {
      const { error: provDelErr } = await supabase
        .from('providers')
        .delete()
        .eq('user_id', user.id)
      if (provDelErr) {
        console.error('Failed to delete provider', provDelErr)
        setSaving(false)
        return
      }
      const { error: svcDelErr } = await supabase
        .from('provider_services')
        .delete()
        .eq('provider_id', user.id)
      if (svcDelErr) {
        console.error('Failed to delete provider services', svcDelErr)
        setSaving(false)
        return
      }
    }

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
    companyName: locale === 'es' ? 'Nombre de la empresa' : 'Company name',
    taxId: locale === 'es' ? 'CUIT' : 'Tax ID',
    services: locale === 'es' ? 'Servicios ofrecidos' : 'Services offered',
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
          <h1 className="text-3xl font-bold text-black tracking-tight mb-6">
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
              <div className="text-xs text-gray-500">{pageT.photoHelp}</div>
            </div>
          </div>

          {/* Editable settings list */}
          <div className="bg-white divide-y divide-gray-200">
            <EditableRow
              label={pageT.name}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <EditableRow
              label={pageT.phone}
              value={phone}
              onChange={handlePhoneChange}
              type="tel"
              error={
                !phoneValid
                  ? locale === 'es'
                    ? 'Formato E.164 requerido'
                    : 'Use E.164 format (+123456789)'
                  : undefined
              }
              displayValue={
                !!phone && (
                  <FiCheckCircle className="text-green-600" title={pageT.verified} />
                )
              }
            />
            <EditableRow
              label={pageT.address}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <EditableRow
              label={pageT.city}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {role === 'provider' && (
              <>
                <EditableRow
                  label={pageT.companyName}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <EditableRow
                  label={pageT.taxId}
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                />
                <div className="py-4">
                  <div className="text-sm font-semibold text-gray-900">
                    {pageT.services}
                  </div>
                  <MultiSelect
                    options={services}
                    selected={selectedServices}
                    onChange={setSelectedServices}
                    locale={locale}
                  />
                </div>
              </>
            )}
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

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSave}
              disabled={saving || !phoneValid}
              className="w-full max-w-xs bg-black hover:bg-gray-800 disabled:opacity-60 text-white font-bold text-lg py-3 rounded-xl transition transform hover:scale-[1.02]"
            >
              {saving ? pageT.updating : pageT.update}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
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

function EditableRow({
  label,
  value,
  onChange,
  type = 'text',
  displayValue,
  error,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  displayValue?: React.ReactNode
  error?: string
}) {
  return (
    <div className="py-4 flex items-center justify-between gap-2">
      <div className="flex-1">
        <label className="text-sm font-semibold text-gray-900">{label}</label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type={type}
            value={value}
            onChange={onChange}
            className={`flex-1 text-sm text-gray-900 border rounded-md p-2 focus:outline-none focus:ring-2 ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-black'
            }`}
          />
          {displayValue}
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  )
}

function MultiSelect({
  options,
  selected,
  onChange,
  locale,
}: {
  options: { id: string; name_en: string; name_es: string }[]
  selected: string[]
  onChange: (ids: string[]) => void
  locale: 'en' | 'es'
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-1 w-full flex flex-wrap items-center gap-1 rounded-md border border-gray-300 bg-white p-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-black"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected.length === 0 ? (
          <span className="text-gray-500">
            {locale === 'es' ? 'Seleccionar servicios' : 'Select services'}
          </span>
        ) : (
          selected.map((id) => {
            const svc = options.find((o) => o.id === id)
            const name = locale === 'es' ? svc?.name_es : svc?.name_en
            return (
              <span
                key={id}
                className="bg-gray-200 rounded px-2 py-0.5 text-xs text-gray-900"
              >
                {name}
              </span>
            )
          })
        )}
      </button>
      {open && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          {options.map((s) => {
            const checked = selected.includes(s.id)
            const name = locale === 'es' ? s.name_es : s.name_en
            return (
              <li
                key={s.id}
                className="cursor-pointer select-none p-2 text-sm hover:bg-gray-100"
              >
                <label className="flex items-center gap-2 text-gray-900">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOption(s.id)}
                    className="rounded border-gray-300"
                  />
                  {name}
                </label>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
