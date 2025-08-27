import { Suspense } from 'react'
import AccessibilityClient from './AccessibilityClient'

export default function AccessibilityPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <AccessibilityClient />
    </Suspense>
  )
}
