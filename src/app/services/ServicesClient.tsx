'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Service, upcomingServices } from '@/lib/serviceCatalog'

type Service = {
  slug: string
  name_es: string
  name_en: string
  rating?: string
  schedule?: string
  image_url: string
  disabled?: boolean
}

const upcomingServices: Service[] = [
  {
    slug: 'air',
    name_es: 'Aires acondicionados',
    name_en: 'Air Conditioning',
    image_url: '/images/services/air.jpg',
    disabled: true
  },
  {
    slug: 'brick',
    name_es: 'Albañilería',
    name_en: 'Masonry',
    image_url: '/images/services/brick.jpg',
    disabled: true
  },
  {
    slug: 'electrician',
    name_es: 'Electricista',
    name_en: 'Electrician',
    image_url: '/images/services/electrician.jpg',
    disabled: true
  },
  {
    slug: 'locksmith',
    name_es: 'Cerrajería',
    name_en: 'Locksmith',
    image_url: '/images/services/locksmith.jpg',
    disabled: true
  },
  {
    slug: 'moving',
    name_es: 'Mudanzas',
    name_en: 'Moving Services',
    image_url: '/images/services/moving.jpg',
    disabled: true
  },
  {
    slug: 'phone',
    name_es: 'Telecomunicaciones',
    name_en: 'Telecommunications',
    image_url: '/images/services/phone.jpg',
    disabled: true
  },
  {
    slug: 'plumbing',
    name_es: 'Plomería',
    name_en: 'Plumbing',
    image_url: '/images/services/plumbing.jpg',
    disabled: true
  }
]

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

  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .schema('api')
        .from('services')
        .select('*')
      if (data) setServices([...data, ...upcomingServices])
      else setServices(upcomingServices)
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
                className={`relative rounded-lg overflow-hidden shadow transition bg-white ${s.disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:shadow-md'}`}
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
