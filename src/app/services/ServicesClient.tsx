'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import type { Service } from '@/lib/serviceCatalog'
import { upcomingServices, serviceOrder } from '@/lib/serviceCatalog'
import { getFooterTranslations } from '@/lib/footerTranslations'

export default function ServicesClient() {
  const [locale, setLocale] = useState<'en' | 'es'>('es')
  const [services, setServices] = useState<Service[]>([])

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
    availableTitle: locale === 'es' ? 'Servicios disponibles' : 'Available Services',
    upcomingTitle: locale === 'es' ? 'Servicios próximos' : 'Upcoming Services',
    providers: locale === 'es' ? 'proveedores' : 'providers',
    schedule: locale === 'es' ? 'Horario estimado' : 'Estimated hours',
  }

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')

      if (error) {
        setServices([])
        return
      }

      const fetched = (data ?? []) as Service[]

      const orderMap: Record<string, number> = {}
      serviceOrder.forEach((slug, index) => {
        orderMap[slug] = index
      })

      const sorted = [...fetched].sort(
        (a, b) => (orderMap[a.slug] ?? Infinity) - (orderMap[b.slug] ?? Infinity)
      )

      setServices(sorted)
    }
    fetchServices()
  }, [])

  const renderCard = (s: Service, extraClass = '') => {
    const name = locale === 'es' ? s.name_es : s.name_en
    const handleClick = () => {
      if (s.disabled) {
        router.push(`/under-construction?lang=${locale}`)
      } else {
        router.push(`/services/${s.slug}?lang=${locale}`)
      }
    }

    return (
      <div
        key={s.slug}
        onClick={handleClick}
        className={`relative rounded-lg overflow-hidden shadow transition bg-white ${
          s.disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:shadow-md'
        } ${extraClass}`}
      >
        <Image
          src={s.image_url}
          alt={name}
          width={250}
          height={160}
          className="w-full h-36 sm:h-40 object-cover"
        />

        {s.disabled && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-semibold">
            {locale === 'es' ? 'Próximamente' : 'Coming Soon'}
          </div>
        )}

        <div className="px-3 py-2">
          <h3 className="font-medium text-sm truncate">{name}</h3>
          {(s.provider_count || s.schedule) && (
            <p className="text-xs text-gray-600">
              {s.provider_count ? `${s.provider_count} ${t.providers}` : ''}
              {s.provider_count && s.schedule ? ' • ' : ''}
              {s.schedule || ''}
            </p>
          )}
        </div>
      </div>
    )
  }

  const footerT = getFooterTranslations(locale)

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

      <main className="pt-24 pb-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-24">
        <section>
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">{t.availableTitle}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((s) => renderCard(s))}
          </div>
        </section>

        {upcomingServices.length > 0 && (
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">{t.upcomingTitle}</h2>
            <div className="flex gap-6 overflow-x-auto pb-2">
              {upcomingServices.map((s) => renderCard(s, 'w-64 flex-shrink-0'))}
            </div>
          </section>
        )}
      </main>
      <Footer t={footerT} locale={locale} />
    </div>
  )
}
