'use client'

import { useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'

export default function ServicesPage() {
  const [locale, setLocale] = useState<'es' | 'en'>('es')

  const toggleLocale = () => setLocale(prev => (prev === 'en' ? 'es' : 'en'))

  const t = {
    servicesTitle: locale === 'es' ? 'Servicios disponibles' : 'Available Services',
    section1: locale === 'es' ? 'Populares cerca tuyo' : 'Popular near you',
    section2: locale === 'es' ? 'Nuevos en la plataforma' : 'New on the platform',
    rating: locale === 'es' ? 'puntuación' : 'rating',
    schedule: locale === 'es' ? 'Horario estimado' : 'Estimated hours'
  }

  const sections = [
    {
      title: t.section1,
      services: [
        {
          name: locale === 'es' ? 'Plomería Express' : 'Express Plumbing',
          rating: '4.8',
          time: '24/7',
          image: '/images/services/plumbing.jpg'
        },
        {
          name: locale === 'es' ? 'Electricistas Rápidos' : 'Quick Electricians',
          rating: '4.6',
          time: '10-18hs',
          image: '/images/services/electrician.jpg'
        },
        {
          name: locale === 'es' ? 'Climatización Hogar' : 'Home A/C Setup',
          rating: '4.9',
          time: '8-20hs',
          image: '/images/services/air.jpg'
        },
        {
          name: locale === 'es' ? 'Pintores Express' : 'Express Painters',
          rating: '4.7',
          time: 'Lunes a viernes',
          image: '/images/services/painting.jpg'
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
          name: locale === 'es' ? 'Fletes y Mudanzas' : 'Moving & Transport',
          rating: '4.6',
          time: 'Flexible',
          image: '/images/services/moving.jpg'
        },
        {
          name: locale === 'es' ? 'Reparación Celulares' : 'Phone Repair',
          rating: '4.4',
          time: '11-17hs',
          image: '/images/services/phone.jpg'
        },
        {
          name: locale === 'es' ? 'Albañiles Zona Norte' : 'Bricklayers North Zone',
          rating: '4.3',
          time: '9-17hs',
          image: '/images/services/brick.jpg'
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
                {locale === 'es' ? 'Ver todos' : 'See all'}
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
