import { Suspense } from 'react'
import MarketComparisonClient from './MarketComparisonClient'

export default function MarketComparisonPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <MarketComparisonClient />
    </Suspense>
  )
}
