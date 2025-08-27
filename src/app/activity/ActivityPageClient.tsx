'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import useUser from '@/features/auth/useUser'
import { supabase } from '@/lib/supabaseClient'

interface ServiceRequest {
  id: string
  service_description: string | null
  request_created_at: string
  request_status?: string | null
  service_slug?: string | null
}

interface Offer {
  request_id: string
  service_slug: string
  description?: string | null
  status?: string | null
  created_at?: string
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
    assigned: locale === 'es' ? 'asignado' : 'assigned',
    noDescription: locale === 'es' ? 'Sin descripción' : 'No description',
  }

  const user = useUser()
  const [role, setRole] = useState<string | null>(null)
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [serviceNames, setServiceNames] = useState<Record<string, { name_en: string; name_es: string }>>({})

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('api.services')
        .select('slug, name_en, name_es')
      const map = Object.fromEntries(
        ((data as { slug: string; name_en: string; name_es: string }[]) || []).map((s) => [s.slug, { name_en: s.name_en, name_es: s.name_es }])
      )
      setServiceNames(map)
    }
    fetchServices()
  }, [])

  const getServiceName = (slug?: string | null) => {
    if (!slug) return ''
    const entry = serviceNames[slug]
    return entry ? (locale === 'es' ? entry.name_es : entry.name_en) : slug
  }

  const getStatusText = (status?: string | null) => {
    if (!status) return pageT.pending
    const s = status.toLowerCase()
    if (s === 'pending') return pageT.pending
    if (s === 'assigned') return pageT.assigned
    return status
  }

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
          .select('id, service_description, request_created_at, request_status, service:service_id(slug)')
          .eq('user_id', user.id)
          .order('request_created_at', { ascending: false })
        const rows =
          (data as {
            id: string
            service_description: string | null
            request_created_at: string
            request_status?: string | null
            service?: { slug?: string | null }
          }[]) || []
        setRequests(
          rows.map((r) => ({
            id: r.id,
            service_description: r.service_description,
            request_created_at: r.request_created_at,
            request_status: r.request_status,
            service_slug: r.service?.slug ?? null,
          }))
        )
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
        let reqData: Record<string, { description: string | null; created_at: string }> = {}
        if (ids.length) {
          const { data: reqs } = await supabase
            .from('api.service_requests')
            .select('id, service_description, request_created_at')
            .in('id', ids)
          const reqEntries =
            (reqs as {
              id: string
              service_description: string | null
              request_created_at: string
            }[]) || []
          reqData = Object.fromEntries(
            reqEntries.map((r) => [r.id, { description: r.service_description, created_at: r.request_created_at }])
          )
        }
        setOffers(
          rows.map((r) => ({
            ...r,
            description: reqData[r.request_id]?.description || null,
            created_at: reqData[r.request_id]?.created_at,
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

          <div className="bg-white">
            {role === 'client' &&
              requests.map((r) => (
                <ActivityCard
                  key={r.id}
                  serviceName={getServiceName(r.service_slug)}
                  description={r.service_description || pageT.noDescription}
                  createdAt={new Date(r.request_created_at).toLocaleDateString()}
                  status={getStatusText(r.request_status)}
                />
              ))}
            {role === 'provider' &&
              offers.map((o) => (
                <ActivityCard
                  key={`${o.request_id}-${o.service_slug}`}
                  serviceName={getServiceName(o.service_slug)}
                  description={o.description || pageT.noDescription}
                  createdAt={
                    o.created_at
                      ? new Date(o.created_at).toLocaleDateString()
                      : ''
                  }
                  status={getStatusText(o.status)}
                />
              ))}
            {!hasData && (
              <div className="py-4 text-left text-gray-500">{pageT.empty}</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function ActivityCard({
  serviceName,
  description,
  createdAt,
  status,
}: {
  serviceName: string
  description: string
  createdAt: string
  status: string
}) {
  return (
    <div className="mb-4 p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{serviceName}</h2>
      <p className="mt-1 text-sm text-gray-700">{description}</p>
      <div className="mt-2 flex justify-between text-sm text-gray-500">
        <span>{createdAt}</span>
        <span className="font-medium text-gray-900">{status}</span>
      </div>
    </div>
  )
}

