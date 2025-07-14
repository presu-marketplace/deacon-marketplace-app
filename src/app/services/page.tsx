import { Suspense } from 'react'
import ServicesClient from './ServicesClient'

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <ServicesClient />
    </Suspense>
  )
}
