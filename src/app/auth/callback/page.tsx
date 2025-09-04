import { Suspense } from 'react'
import CallbackBody from './CallbackBody'

// Evita el prerender en build para esta ruta
export const dynamic = 'force-dynamic'      // o: export const revalidate = 0

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-500">Restaurando sesión...</div>}>
      <CallbackBody />
    </Suspense>
  )
}
