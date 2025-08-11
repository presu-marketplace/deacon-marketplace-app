import { Suspense } from 'react'
import ActivityPage from './ActivityPageClient'

export default function Page() {
  return (
    <Suspense fallback={<div className="pt-32 px-6">Loading…</div>}>
      <ActivityPage />
    </Suspense>
  )
}

