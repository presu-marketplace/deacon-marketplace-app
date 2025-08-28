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
  service_id?: string | null
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
    open: locale === 'es' ? 'abierto' : 'open',
    closed: locale === 'es' ? 'cerrado' : 'closed',
    pending: locale === 'es' ? 'pendiente' : 'pending',
    assigned: locale === 'es' ? 'asignado' : 'assigned',
    noDescription: locale === 'es' ? 'Sin descripción' : 'No description',
  }

  const user = useUser()
  const [role, setRole] = useState<string | null>(null)
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [serviceNames, setServiceNames] = useState<
    Record<string, { slug: string; name_en: string; name_es: string }>
  >({})

  const fetchFromApi = async <T,>(
    path: string,
    params: URLSearchParams,
  ): Promise<T | null> => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return null
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${path}?${params.toString()}`
    const headers = {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${session.access_token}`,
    }
    let res = await fetch(url, { headers })
    if (res.status === 403) {
      const { data: refreshed } = await supabase.auth.refreshSession()
      if (refreshed.session) {
        res = await fetch(url, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${refreshed.session.access_token}`,
          },
        })
      }
    }
    if (!res.ok) {
      console.error('API request failed', res.status, await res.text())
      return null
    }
    return (await res.json()) as T
  }

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('id, slug, name_en, name_es')
      const map = Object.fromEntries(
        ((data as { id: string; slug: string; name_en: string; name_es: string }[]) || []).map((s) => [
          s.id,
          { slug: s.slug, name_en: s.name_en, name_es: s.name_es },
        ])
      )
      setServiceNames(map)
    }
    fetchServices()
  }, [])

  const getServiceName = (key?: string | null) => {
    if (!key) return ''
    const entry =
      serviceNames[key] || Object.values(serviceNames).find((s) => s.slug === key)
    if (!entry) return ''
    return (locale === 'es' ? entry.name_es : entry.name_en) || entry.slug
  }

  const getStatusBadges = (status?: string | null) => {
    const s = status?.toLowerCase()
    if (s === 'open')
      return [{ label: pageT.open, className: 'bg-yellow-100 text-yellow-700' }]
    if (s === 'assigned')
      return [
        { label: pageT.closed, className: 'bg-green-100 text-green-700' },
        { label: pageT.assigned, className: 'bg-blue-100 text-blue-700' },
      ]
    return [{ label: pageT.closed, className: 'bg-green-100 text-green-700' }]
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      setLoading(true)

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      const userRole = profile?.role ?? 'client'
      setRole(userRole)

      if (userRole === 'client') {
        const params = new URLSearchParams({
          select:
            'id, service_id, service_description, request_created_at, request_status',
          user_id: `eq.${user.id}`,
          order: 'request_created_at.desc',
        })
        const rows =
          (await fetchFromApi<{
            id: string
            service_id: string | null
            service_description: string | null
            request_created_at: string
            request_status?: string | null
          }[]>('service_requests', params)) || []
        setRequests(
          rows.map((r) => ({
            id: r.id,
            service_id: r.service_id,
            service_description: r.service_description,
            request_created_at: r.request_created_at,
            request_status: r.request_status,
          }))
        )
      } else if (userRole === 'provider') {
        const baseParams = new URLSearchParams({
          select: 'request_id, service_slug, status',
          provider_id: `eq.${user.id}`,
        })
        let rows =
          (await fetchFromApi<{
            request_id: string
            service_slug: string
            status?: string | null
          }[]>('service_request_services', baseParams)) || []
        if (!rows.length) {
          const fallback = await fetchFromApi<{
            request_id: string
            service_slug: string
            status?: string | null
          }[]>(
            'service_request_services',
            new URLSearchParams({
              select: 'request_id, service_slug',
              provider_id: `eq.${user.id}`,
            }),
          )
          rows = fallback || []
        }
        const ids = rows.map((r) => r.request_id)
        let reqData: Record<string, { description: string | null; created_at: string }> = {}
        if (ids.length) {
          const reqParams = new URLSearchParams({
            select: 'id, service_description, request_created_at',
            id: `in.(${ids.join(',')})`,
          })
          const reqs =
            (await fetchFromApi<{
              id: string
              service_description: string | null
              request_created_at: string
            }[]>('service_requests', reqParams)) || []
          reqData = Object.fromEntries(
            reqs.map((r) => [r.id, { description: r.service_description, created_at: r.request_created_at }]),
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
            {hasData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {role === 'client' &&
                  requests.map((r) => (
                    <ActivityCard
                      key={r.id}
                      serviceName={getServiceName(r.service_id)}
                      description={r.service_description || pageT.noDescription}
                      createdAt={new Date(r.request_created_at).toLocaleDateString()}
                      statuses={getStatusBadges(r.request_status)}
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
                      statuses={getStatusBadges(o.status)}
                    />
                  ))}
              </div>
            ) : (
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
  statuses,
}: {
  serviceName: string
  description: string
  createdAt: string
  statuses: { label: string; className: string }[]
}) {
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{serviceName}</h2>
        <div className="flex gap-2">
          {statuses.map((s) => (
            <span
              key={s.label}
              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${s.className}`}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-700">{description}</p>
      <div className="mt-4 text-sm text-gray-500">{createdAt}</div>
    </div>
  )
}

