"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
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
    cleaningType: 'Tipo de Servicio',
    cleaningTypePlaceholder: 'Seleccione una opción',
    cleaningOptions: [
      'Limpieza y mantenimiento de oficina',
      'Limpieza de vidrios en altura',
      'Limpieza de frente',
      'Final de obra',
      'Limpieza de alfombras y sillones',
      'Hidrolavado',
      'Tratamiento de residuos patológicos',
      'Limpieza de planta industrial',
      'Mantenimiento de jardines y espacios verdes',
      'Servicio de pulido de pisos',
      'Plastificado de pisos',
      'Desinfección',
      'Desratización',
      'Desinsectación',
      'Limpieza de ferrocarril/subterráneos',
      'Mudanzas',
      'Parquización'
    ],
    frequency: 'Frecuencia',
    frequencyOptions: ['Día', 'Semana', 'Mes'],
    address: 'Dirección',
    addressPlaceholder: 'Dirección',
    city: 'Localidad',
    cityPlaceholder: 'Localidad',
    message: 'Mensaje',
    messagePlaceholder: 'Escribe tu mensaje',
    invoices: '¿Ya tienes otras ofertas? Sube hasta 3 facturas…',
    invoicesHint: 'Archivos PDF o imagen',
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
    cleaningType: 'Service Type',
    cleaningTypePlaceholder: 'Select an option',
    cleaningOptions: [
      'Office cleaning & maintenance',
      'High-rise window cleaning',
      'Facade cleaning',
      'Post-construction',
      'Carpet & upholstery cleaning',
      'Pressure washing',
      'Pathological waste treatment',
      'Industrial plant cleaning',
      'Gardens & green areas maintenance',
      'Floor polishing service',
      'Floor sealing (plasticizing)',
      'Disinfection',
      'Rodent control',
      'Insect control',
      'Rail/Subway cleaning',
      'Moving services',
      'Landscaping'
    ],
    frequency: 'Frequency',
    frequencyOptions: ['Day', 'Week', 'Month'],
    address: 'Address',
    addressPlaceholder: 'Address',
    city: 'City',
    cityPlaceholder: 'City',
    message: 'Message',
    messagePlaceholder: 'Write your message',
    invoices: 'Already have other offers? Upload up to 3 invoices.',
    invoicesHint: 'PDF or image files',
    send: 'Send'
  }
}

const serviceInfo = {
  seguridad: {
    esName: 'Seguridad privada',
    enName: 'Private Security',
    esDesc: 'Protección integral para hogares y negocios.',
    enDesc: 'Comprehensive protection for homes and businesses.',
    image: '/images/services/security.jpg',
    rating: '4.8'
  },
  limpieza: {
    esName: 'Limpieza Profesional',
    enName: 'Professional Cleaning',
    esDesc: 'Servicios de limpieza detallados para cualquier espacio.',
    enDesc: 'Detailed cleaning services for any space.',
    image: '/images/services/cleaning.jpg',
    rating: '4.7'
  },
  fumigacion: {
    esName: 'Fumigación a domicilio',
    enName: 'Home Fumigation',
    esDesc: 'Eliminación de plagas con técnicas seguras.',
    enDesc: 'Pest removal with safe techniques.',
    image: '/images/services/fumigation.jpg',
    rating: '4.6'
  },
  'mantenimiento-ascensores': {
    esName: 'Mantenimiento de ascensores',
    enName: 'Elevator Maintenance',
    esDesc: 'Mantenimiento preventivo y correctivo de ascensores.',
    enDesc: 'Preventive and corrective elevator maintenance.',
    image: '/images/services/elevator_maintenance.jpg',
    rating: '4.5'
  },
  escribania: {
    esName: 'Escribanía',
    enName: 'Notary Services',
    esDesc: 'Gestiones notariales con profesionales matriculados.',
    enDesc: 'Notarial procedures by licensed professionals.',
    image: '/images/services/notary.jpg',
    rating: '4.7'
  },
  'community-manager': {
    esName: 'Community Manager',
    enName: 'Community Manager',
    esDesc: 'Gestión de redes sociales para tu marca.',
    enDesc: 'Social media management for your brand.',
    image: '/images/services/community.jpg',
    rating: '4.5'
  },
  'traslados-ejecutivos': {
    esName: 'Traslados Ejecutivos',
    enName: 'Executive Transfers',
    esDesc: 'Transporte ejecutivo cómodo y seguro.',
    enDesc: 'Comfortable and safe executive transport.',
    image: '/images/services/transfer.jpg',
    rating: '4.8'
  },
  'salones-infantiles': {
    esName: 'Salones Infantiles',
    enName: 'Kids Party Venues',
    esDesc: 'Espacios ideales para fiestas infantiles.',
    enDesc: 'Ideal spaces for kids parties.',
    image: '/images/services/kids-party.jpg',
    rating: '4.6'
  }
} as const

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
  const [cleaningType, setCleaningType] = useState('')
  const [frequency, setFrequency] = useState<string[]>([])
  const [direccion, setDireccion] = useState('')
  const [localidad, setLocalidad] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [sistemas, setSistemas] = useState<string[]>([])
  const [invoices, setInvoices] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)

  const isSeguridad = service.toLowerCase() === 'seguridad'
  const t = translations[locale]
  type ServiceInfo = typeof serviceInfo[keyof typeof serviceInfo]
  const info: ServiceInfo =
    (serviceInfo as Record<string, ServiceInfo>)[service] || {
      esName: service,
      enName: service,
      esDesc: '',
      enDesc: '',
      image: '',
      rating: ''
    }

  useEffect(() => {
    if (isSeguridad) {
      const defaultOpt = translations[locale].sistemasOptions[0]
      setSistemas([defaultOpt])
    } else {
      setSistemas([])
    }
  }, [isSeguridad, locale])

  const toggleSistema = (value: string) => {
    setSistemas(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    )
  }

  const toggleFrequency = (value: string) => {
    setFrequency(prev =>
      prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
    )
  }

  const handleInvoicesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files ? Array.from(e.target.files).slice(0, 3) : []
    setInvoices(files)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      nombre,
      email,
      telefono,
      sistemas,
      tipoPropiedad,
      cleaningType,
      frequency,
      direccion,
      localidad,
      mensaje,
      invoices
    })
    setSubmitted(true)
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
    <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <Navbar locale={locale} toggleLocale={toggleLocale} t={navT} forceWhite />
      <main className="flex-grow pt-24 pb-12">
        {info.image && (
          <div className="relative w-full h-48 md:h-64">
            <Image
              src={info.image}
              alt={locale === 'es' ? info.esName : info.enName}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}
        <div className="max-w-5xl mx-auto px-4 mt-6">
          <nav className="mb-4 text-xs text-gray-600">
            <button
              onClick={() => router.push(`/services?lang=${locale}`)}
              className="hover:underline"
            >
              {locale === 'es' ? 'Servicios' : 'Services'}
            </button>
            <span className="mx-1">→</span>
            <span>{locale === 'es' ? info.esName : info.enName}</span>
            <span className="mx-1">→</span>
            <span className="font-medium">{locale === 'es' ? 'Solicitud' : 'Request'}</span>
          </nav>
          <div className="mb-8">
            <ol className="flex items-center justify-between text-xs sm:text-sm">
              <li className="flex items-center flex-1">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white text-sm">✓</span>
                <span className="ml-2 flex items-center">
                  <span className="mr-1">🛠️</span>
                  {locale === 'es' ? 'Seleccionar servicio' : 'Select Service'}
                </span>
                <span className="flex-1 h-0.5 bg-green-500 mx-4"></span>
              </li>
              <li className="flex items-center flex-1">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white text-sm">2</span>
                <span className="ml-2 flex items-center font-medium">
                  <span className="mr-1">📝</span>
                  {locale === 'es' ? 'Completar solicitud' : 'Fill Request'}
                </span>
                <span className="flex-1 h-0.5 bg-gray-300 mx-4"></span>
              </li>
              <li className="flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300 text-gray-400 text-sm">3</span>
                <span className="ml-2 flex items-center">
                  <span className="mr-1">✅</span>
                  {locale === 'es' ? 'Confirmación' : 'Confirmation'}
                </span>
              </li>
            </ol>
          </div>
          <div className="max-w-lg mx-auto">
              <h1 className="text-2xl font-bold mb-4">
                {locale === 'es' ? info.esName : info.enName}
              </h1>
              {info.rating && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">⭐ {info.rating}</p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                {locale === 'es' ? info.esDesc : info.enDesc}
              </p>
              <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-xl"
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
              {service.toLowerCase() === 'fumigacion' && (
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
              )}
              {service.toLowerCase() === 'limpieza' && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium mb-1" htmlFor="cleaningType">
                    {t.cleaningType}
                  </label>
                  <select
                    id="cleaningType"
                    value={cleaningType}
                    onChange={e => setCleaningType(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white hover:border-gray-400"
                  >
                    <option value="">{t.cleaningTypePlaceholder}</option>
                    {t.cleaningOptions.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {service.toLowerCase() === 'limpieza' && (
                <div className="sm:col-span-2">
                  <span className="block text-xs font-medium mb-1">{t.frequency}</span>
                  <div className="flex flex-wrap gap-2">
                    {t.frequencyOptions.map(opt => (
                      <label
                        key={opt}
                        className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        <input
                          type="checkbox"
                          checked={frequency.includes(opt)}
                          onChange={() => toggleFrequency(opt)}
                          className="h-4 w-4 text-black dark:text-white focus:ring-black dark:focus:ring-white"
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
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
                <label
                  className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
                  htmlFor="invoices"
                >
                  {t.invoices}
                </label>
                <input
                  id="invoices"
                  type="file"
                  multiple
                  accept="application/pdf,image/*"
                  onChange={handleInvoicesChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white hover:border-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-black file:text-white hover:file:bg-gray-900 file:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {invoices.length > 0
                    ? invoices.map(f => f.name).join(', ')
                    : t.invoicesHint}
                </p>
              </div>
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
        </div>
        </div>
      </main>
      <Footer t={footerT} />
        {submitted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-lg">
            <span className="text-3xl mb-2 inline-block animate-bounce text-green-500">✓</span>
            <h2 className="text-lg font-semibold mb-2">
              {locale === 'es' ? 'Solicitud enviada' : 'Request Sent'}
            </h2>
            <p className="text-sm mb-4">
              {locale === 'es'
                ? 'Nos contactaremos contigo en menos de 24 horas.'
                : 'We will get back to you within 24 hours.'}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-black text-white rounded-full px-4 py-2 text-sm hover:bg-gray-900"
            >
              {locale === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

