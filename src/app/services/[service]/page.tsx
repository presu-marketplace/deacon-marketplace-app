import { Suspense } from 'react'
import ServiceFormClient from './ServiceFormClient'

export default function ServiceFormPage({ params }: { params: { service: string } }) {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <ServiceFormClient service={params.service} />
    </Suspense>
  )
}
