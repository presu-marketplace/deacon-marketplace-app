import { Suspense } from 'react'
import ServiceFormClient from './ServiceFormClient'

export default async function ServiceFormPage({
  params
}: {
  params: Promise<{ service: string }>
}) {
  const { service } = await params
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <ServiceFormClient service={service} />
    </Suspense>
  )
}
