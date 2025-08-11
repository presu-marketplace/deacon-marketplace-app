import { Suspense } from 'react'
import ForgotPasswordClient from './components/ForgotPasswordClient'

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-400">Loading...</div>}>
      <ForgotPasswordClient />
    </Suspense>
  )
}
