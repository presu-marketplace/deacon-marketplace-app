'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import { useSearchParams, useRouter } from 'next/navigation'

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
    section1: locale === 'es' ? 'Populares cerca tuyo' : 'Popular near you',
    section2: locale === 'es' ? 'Nuevos en la plataforma' : 'New on the platform',
    rating: locale === 'es' ? 'puntuación' : 'rating',
    schedule: locale === 'es' ? 'Horario estimado' : 'Estimated hours',
    seeAll: locale === 'es' ? 'Ver todos' : 'See all',
  }

  const sections = [
    {
      title: t.section1,
      services: [
        {
          name: locale === 'es' ? 'Seguridad privada' : 'Private Security',
          rating: '4.8',
          time: '24/7',
          image: '/images/services/security.jpg'
        },
        {
          name: locale === 'es' ? 'Limpieza Profesional' : 'Professional Cleaning',
          rating: '4.7',
          time: '9-18hs',
          image: '/images/services/cleaning.jpg'
        },
        {
          name: locale === 'es' ? 'Fumigación a domicilio' : 'Home Fumigation',
          rating: '4.6',
          time: '10-17hs',
          image: '/images/services/fumigation.jpg'
        },
        {
          name: locale === 'es' ? 'Mantenimiento de ascensores' : 'Elevator Maintenance',
          rating: '4.5',
          time: '8-16hs',
          image: '/images/services/elevator_maintenance.jpg'
        }
      ]
    },
    {
      title: t.section2,
      services: [
        {
          name: locale === 'es' ? 'Cerrajeros 24hs' : '24h Locksmiths',
          rating: '4.5',
          time: '24hs',
          image: '/images/services/locksmith.jpg'
        },
        {
          name: locale === 'es' ? 'Escribanía' : 'Notary Services',
          rating: '4.7',
          time: '10-18hs',
          image: '/images/services/notary.jpg'
        },
        {
          name: locale === 'es' ? 'Community Manager' : 'Community Manager',
          rating: '4.5',
          time: 'Online',
          image: '/images/services/community.jpg'
        },
        {
          name: locale === 'es' ? 'Traslados Ejecutivos (Combi)' : 'Executive Transfers (Combi)',
          rating: '4.8',
          time: '24/7',
          image: '/images/services/transfer.jpg'
        },
        {
          name: locale === 'es' ? 'Salones Infantiles' : 'Kids Party Venues',
          rating: '4.6',
          time: 'Fines de semana',
          image: '/images/services/kids-party.jpg'
        }
      ]
    }
  ]

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

        {sections.map((section, idx) => (
          <div key={idx} className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <button className="text-sm text-gray-500 hover:underline">
                {t.seeAll}
              </button>
            </div>

            <div className="flex overflow-x-auto space-x-4 pb-2">
              {section.services.map((s, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[250px] rounded-lg overflow-hidden shadow hover:shadow-md transition bg-white"
                >
                  <Image
                    src={s.image}
                    alt={s.name}
                    width={250}
                    height={160}
                    className="w-full h-36 sm:h-40 object-cover"
                  />
                  <div className="px-3 py-2">
                    <h3 className="font-medium text-sm truncate">{s.name}</h3>
                    <p className="text-xs text-gray-600">⭐ {s.rating} • {s.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
