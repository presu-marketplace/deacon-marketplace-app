import { Suspense } from 'react'
import PrivacyClient from './PrivacyClient'

export default function PrivacyPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <PrivacyClient />
    </Suspense>
  )
}
