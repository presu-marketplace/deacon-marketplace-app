'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function ServicesClient() {
  const [locale, setLocale] = useState<'en' | 'es'>('es')

  const searchParams = useSearchParams()
  const langParam = searchParams.get('lang')
  const router = useRouter()

  useEffect(() => {
    if (langParam === 'es' || langParam === 'en') {
      setLocale(langParam)
    } else {
      const browserLang = navigator.language.startsWith('es') ? 'es' : 'en'
      setLocale(browserLang)
    }
  }, [langParam])

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'es' : 'en'
    setLocale(newLocale)
    router.push(`?lang=${newLocale}`)
  }

  const t = {
    servicesTitle: locale === 'es' ? 'Servicios disponibles' : 'Available Services',
    rating: locale === 'es' ? 'puntuación' : 'rating',
    schedule: locale === 'es' ? 'Horario estimado' : 'Estimated hours',
  }

  type Service = {
    slug: string
    name_es?: string
    name_en?: string
    name?: string
    rating?: string
    schedule?: string
    image_url?: string
  }

  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from<Service>('services')
        .select('*')
      if (data) setServices(data)
    }
    fetchServices()
  }, [])

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar
        locale={locale}
        toggleLocale={toggleLocale}
        t={{
          login: locale === 'es' ? 'Iniciar sesión' : 'Log in',
          signup: locale === 'es' ? 'Crear cuenta' : 'Sign up',
          language: locale === 'es' ? 'Español' : 'English',
          searchPlaceholder: '',
          joinAsPro: '',
          howItWorks: ''
        }}
      />

      <main className="pt-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">{t.servicesTitle}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((s) => {
            const name =
              locale === 'es'
                ? s.name_es || s.name
                : s.name_en || s.name
            return (
              <div
                key={s.slug}
                onClick={() => router.push(`/services/${s.slug}?lang=${locale}`)}
                className="relative rounded-lg overflow-hidden shadow hover:shadow-md transition bg-white cursor-pointer"
              >
                <Image
                  src={s.image_url || `/images/services/${s.slug}.jpg`}
                  alt={name || s.slug}
                  width={250}
                  height={160}
                  className="w-full h-36 sm:h-40 object-cover"
                />
                <div className="px-3 py-2">
                  <h3 className="font-medium text-sm truncate">{name}</h3>
                  {(s.rating || s.schedule) && (
                    <p className="text-xs text-gray-600">
                      {s.rating ? `⭐ ${s.rating}` : ''}
                      {s.rating && s.schedule ? ' • ' : ''}
                      {s.schedule || ''}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
