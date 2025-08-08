"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const sistemasOptions = [
  'Seguridad Física',
  'TOTEM',
  'Alarma y CCTV',
  'Control de acceso',
  'Reparación y mantenimiento',
  'Custodia de mercadería',
  'Otro'
]

const propertyTypes = [
  'Departamento',
  'Casa',
  'Edificios y condominios',
  'Country privado',
  'Empresa o industria',
  'Comercio',
  'Proyecto en construcción'
]

type Props = {
  service: string
}

const serviceTitles: Record<string, string> = {
  seguridad: 'Seguridad',
  limpieza: 'Limpieza Profesional',
  fumigacion: 'Fumigación a domicilio',
  'mantenimiento-ascensores': 'Mantenimiento de ascensores',
  escribania: 'Escribanía',
  'community-manager': 'Community Manager',
  'traslados-ejecutivos': 'Traslados Ejecutivos (Combi)',
  'salones-infantiles': 'Salones Infantiles'
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

  const toggleSistema = (value: string) => {
    setSistemas((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder for form submission logic
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

  const title = serviceTitles[service] || service

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col">
      <Navbar locale={locale} toggleLocale={toggleLocale} t={navT} forceWhite />
      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl space-y-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-lg"
        >
          <h1 className="text-2xl font-bold text-center mb-4">Solicitar servicio: {title}</h1>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="telefono">
              Teléfono
            </label>
            <input
              id="telefono"
              type="tel"
              placeholder="Tu teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          {isSeguridad && (
            <div>
              <span className="block text-sm font-medium mb-1">Sistemas de interés</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sistemasOptions.map((opt) => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={sistemas.includes(opt)}
                      onChange={() => toggleSistema(opt)}
                      className="h-4 w-4 accent-red-500"
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="tipoPropiedad">
              Tipo de Propiedad
            </label>
            <select
              id="tipoPropiedad"
              value={tipoPropiedad}
              onChange={(e) => setTipoPropiedad(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Seleccione...</option>
              {propertyTypes.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="direccion">
              Dirección
            </label>
            <input
              id="direccion"
              type="text"
              placeholder="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="localidad">
              Localidad
            </label>
            <input
              id="localidad"
              type="text"
              placeholder="Localidad"
              value={localidad}
              onChange={(e) => setLocalidad(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="mensaje">
              Mensaje
            </label>
            <textarea
              id="mensaje"
              placeholder="Escribe tu mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={4}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-full transition"
          >
            Enviar
          </button>
        </form>
      </main>
      <Footer t={footerT} />
    </div>
  )
}
