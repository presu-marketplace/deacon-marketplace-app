import { Suspense } from 'react'
import RegisterPageClient from './components/RegisterClient'

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-600">Loading...</div>}>
      <RegisterPageClient />
    </Suspense>
  )
}
