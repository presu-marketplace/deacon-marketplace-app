'use client'

import { useState } from 'react'

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

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl space-y-4 border border-gray-200 rounded-lg p-6 shadow"
      >
        <h1 className="text-2xl font-bold mb-4">Solicitar servicio: {title}</h1>
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
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
                    className="h-4 w-4"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Propiedad</label>
          <select
            value={tipoPropiedad}
            onChange={(e) => setTipoPropiedad(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
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
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Localidad</label>
          <input
            type="text"
            value={localidad}
            onChange={(e) => setLocalidad(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mensaje</label>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
        >
          Enviar
        </button>
      </form>
    </div>
  )
}
