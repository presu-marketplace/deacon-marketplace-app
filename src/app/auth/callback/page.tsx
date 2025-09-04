import { Suspense } from 'react'
import { CallbackBody } from './CallbackBody' // <- will be a Client Component

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-200">Restaurando sesión...</div>}>
      <CallbackBody />
    </Suspense>
  )
}
