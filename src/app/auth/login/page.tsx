import { Suspense } from 'react'
import LoginPageClient from './components/LoginClient'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-400">Loading...</div>}>
      <LoginPageClient />
    </Suspense>
  )
}
