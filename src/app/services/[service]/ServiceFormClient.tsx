"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const translations = {
  es: {
    name: 'Nombre',
    namePlaceholder: 'Tu nombre',
    email: 'Email',
    emailPlaceholder: 'tu@email.com',
    phone: 'Teléfono',
    phonePlaceholder: 'Tu teléfono',
    sistemasTitle: 'Sistemas de interés',
    sistemasOptions: [
      'Seguridad Física',
      'TOTEM',
      'Alarma y CCTV',
      'Control de acceso',
      'Reparación y mantenimiento',
      'Custodia de mercadería',
      'Otro'
    ],
    propertyType: 'Tipo de Propiedad',
    propertyTypePlaceholder: 'Seleccione...',
    propertyTypes: [
      'Departamento',
      'Casa',
      'Edificios y condominios',
      'Country privado',
      'Empresa o industria',
      'Comercio',
      'Proyecto en construcción'
    ],
    address: 'Dirección',
    addressPlaceholder: 'Dirección',
    city: 'Localidad',
    cityPlaceholder: 'Localidad',
    message: 'Mensaje',
    messagePlaceholder: 'Escribe tu mensaje',
    send: 'Enviar'
  },
  en: {
    name: 'Name',
    namePlaceholder: 'Your name',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    phone: 'Phone',
    phonePlaceholder: 'Your phone',
    sistemasTitle: 'Systems of Interest',
    sistemasOptions: [
      'Physical Security',
      'TOTEM',
      'Alarm & CCTV',
      'Access Control',
      'Repair & Maintenance',
      'Merchandise Custody',
      'Other'
    ],
    propertyType: 'Property Type',
    propertyTypePlaceholder: 'Select...',
    propertyTypes: [
      'Apartment',
      'House',
      'Buildings & Condominiums',
      'Gated Community',
      'Company or Industry',
      'Commerce',
      'Construction Project'
    ],
    address: 'Address',
    addressPlaceholder: 'Address',
    city: 'City',
    cityPlaceholder: 'City',
    message: 'Message',
    messagePlaceholder: 'Write your message',
    send: 'Send'
  }
}

type Props = {
  service: string
}

export default function ServiceFormClient({ service }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [locale, setLocale] = useState<'es' | 'en'>('es')
  const langParam = searchParams.get('lang')

  useEffect(() => {
    if (langParam === 'es' || langParam === 'en') {
      setLocale(langParam)
    } else {
      const browserLang = navigator.language.startsWith('es') ? 'es' : 'en'
      setLocale(browserLang)
    }
  }, [langParam])

  const toggleLocale = () => {
    const newLocale = locale === 'es' ? 'en' : 'es'
    setLocale(newLocale)
    router.push(`?lang=${newLocale}`)
  }

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [tipoPropiedad, setTipoPropiedad] = useState('')
  const [direccion, setDireccion] = useState('')
  const [localidad, setLocalidad] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [sistemas, setSistemas] = useState<string[]>([])

  const isSeguridad = service.toLowerCase() === 'seguridad'
  const t = translations[locale]

  const toggleSistema = (value: string) => {
    setSistemas(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      nombre,
      email,
      telefono,
      sistemas,
      tipoPropiedad,
      direccion,
      localidad,
      mensaje
    })
  }

  const navT = {
    login: locale === 'es' ? 'Iniciar sesión' : 'Log in',
    signup: locale === 'es' ? 'Crear cuenta' : 'Sign up',
    language: locale === 'es' ? 'Español' : 'English',
    searchPlaceholder: '',
    joinAsPro: '',
    howItWorks: ''
  }

  const footerT = {
    terms: locale === 'es' ? 'Términos de uso' : 'Terms of Use',
    privacy: locale === 'es' ? 'Política de privacidad' : 'Privacy Policy',
    sitemap: locale === 'es' ? 'Mapa del sitio' : 'Sitemap',
    accessibility: locale === 'es' ? 'Accesibilidad' : 'Accessibility',
    footerNote:
      locale === 'es'
        ? 'No vender ni compartir mi información personal'
        : 'Do Not Sell or Share My Personal Information',
    copyright: locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white flex flex-col">
      <Navbar locale={locale} toggleLocale={toggleLocale} t={navT} forceWhite />
      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" htmlFor="nombre">
                {t.name}
              </label>
              <input
                id="nombre"
                type="text"
                placeholder={t.namePlaceholder}
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white hover:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" htmlFor="email">
                {t.email}
              </label>
              <input
                id="email"
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white hover:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" htmlFor="telefono">
                {t.phone}
              </label>
              <input
                id="telefono"
                type="tel"
                placeholder={t.phonePlaceholder}
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white hover:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" htmlFor="tipoPropiedad">
                {t.propertyType}
              </label>
              <select
                id="tipoPropiedad"
                value={tipoPropiedad}
                onChange={e => setTipoPropiedad(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white hover:border-gray-400"
              >
                <option value="">{t.propertyTypePlaceholder}</option>
                {t.propertyTypes.map(pt => (
                  <option key={pt} value={pt}>
                    {pt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" htmlFor="direccion">
                {t.address}
              </label>
              <input
                id="direccion"
                type="text"
                placeholder={t.addressPlaceholder}
                value={direccion}
                onChange={e => setDireccion(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white hover:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" htmlFor="localidad">
                {t.city}
              </label>
              <input
                id="localidad"
                type="text"
                placeholder={t.cityPlaceholder}
                value={localidad}
                onChange={e => setLocalidad(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white hover:border-gray-400"
              />
            </div>
            {isSeguridad && (
              <div className="sm:col-span-2">
                <span className="block text-xs font-medium mb-1">{t.sistemasTitle}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {t.sistemasOptions.map(opt => (
                    <label
                      key={opt}
                      className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <input
                        type="checkbox"
                        checked={sistemas.includes(opt)}
                        onChange={() => toggleSistema(opt)}
                        className="h-4 w-4 text-black dark:text-white focus:ring-black dark:focus:ring-white"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1" htmlFor="mensaje">
                {t.message}
              </label>
              <textarea
                id="mensaje"
                placeholder={t.messagePlaceholder}
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white hover:border-gray-400"
                rows={4}
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full bg-black text-white rounded-full px-6 py-3 text-sm font-medium shadow hover:bg-gray-900 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700"
              >
                {t.send}
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer t={footerT} />
    </div>
  )
}

