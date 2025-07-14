import { Suspense } from 'react'
import SustainabilityClient from './SustainabilityClient'

export default function SustainabilityPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <SustainabilityClient />
    </Suspense>
  )
}
