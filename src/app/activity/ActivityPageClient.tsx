'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import useUser from '@/features/auth/useUser'
import { supabase } from '@/lib/supabaseClient'

interface ServiceRequest {
  id: string
  description: string | null
  created_at: string
}

interface Offer {
  request_id: string
  service_slug: string
  description?: string | null
  status?: string | null
}

export default function ActivityPage() {
  const searchParams = useSearchParams()
  const langParam = searchParams.get('lang')

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

  const pageT = {
    title: locale === 'es' ? 'Actividad' : 'Activity',
    loading: locale === 'es' ? 'Cargando...' : 'Loading...',
    empty: locale === 'es' ? 'Sin actividad' : 'No activity yet',
    pending: locale === 'es' ? 'pendiente' : 'pending',
    noDescription: locale === 'es' ? 'Sin descripción' : 'No description',
  }

  const user = useUser()
  const [role, setRole] = useState<string | null>(null)
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      setLoading(true)

      const { data: profile } = await supabase
        .from('api.profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      const userRole = profile?.role ?? 'client'
      setRole(userRole)

      if (userRole === 'client') {
        const { data } = await supabase
          .from('api.service_requests')
          .select('id, description, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        setRequests((data as ServiceRequest[]) || [])
      } else if (userRole === 'provider') {
        const { data: offerRows, error } = await supabase
          .from('api.service_request_services')
          .select('request_id, service_slug, status')
          .eq('provider_id', user.id)
        let rows: { request_id: string; service_slug: string; status?: string | null }[] =
          (offerRows as { request_id: string; service_slug: string; status?: string | null }[]) || []
        if (error) {
          const { data: fallback } = await supabase
            .from('api.service_request_services')
            .select('request_id, service_slug')
            .eq('provider_id', user.id)
          rows =
            (fallback as { request_id: string; service_slug: string; status?: string | null }[]) || []
        }
        const ids = rows.map((r) => r.request_id)
        let descriptions: Record<string, string | null> = {}
        if (ids.length) {
          const { data: reqs } = await supabase
            .from('api.service_requests')
            .select('id, description')
            .in('id', ids)
          const reqEntries = (reqs as { id: string; description: string | null }[]) || []
          descriptions = Object.fromEntries(reqEntries.map((r) => [r.id, r.description]))
        }
        setOffers(
          rows.map((r) => ({
            ...r,
            description: descriptions[r.request_id] || null,
          }))
        )
      }
      setLoading(false)
    }
    fetchData()
  }, [user])

  if (!user || loading)
    return (
      <>
        <Navbar locale={locale} toggleLocale={toggleLocale} t={t} forceWhite />
        <div className="bg-white min-h-screen pt-32">
          <div className="max-w-6xl mx-auto px-6 py-8">{pageT.loading}</div>
        </div>
      </>
    )

  const hasData =
    (role === 'client' && requests.length > 0) ||
    (role === 'provider' && offers.length > 0)

  return (
    <>
      <Navbar locale={locale} toggleLocale={toggleLocale} t={t} forceWhite />
      <div className="bg-white min-h-screen pt-32">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-black tracking-tight mb-6">
            {pageT.title}
          </h1>

          <div className="bg-white divide-y divide-gray-200">
            {role === 'client' &&
              requests.map((r) => (
                <Row
                  key={r.id}
                  label={r.description || pageT.noDescription}
                  value={new Date(r.created_at).toLocaleDateString()}
                />
              ))}
            {role === 'provider' &&
              offers.map((o) => (
                <Row
                  key={`${o.request_id}-${o.service_slug}`}
                  label={o.description || pageT.noDescription}
                  value={
                    o.status ? `${o.service_slug} – ${o.status}` : o.service_slug
                  }
                />
              ))}
            {!hasData && (
              <div className="py-4 text-sm text-gray-500">{pageT.empty}</div>
            )}
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
    </div>
  )
}

