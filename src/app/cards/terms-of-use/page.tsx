import { Suspense } from 'react'
import TermsClient from './TermsClient'

export default function TermsPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <TermsClient />
    </Suspense>
  )
}
