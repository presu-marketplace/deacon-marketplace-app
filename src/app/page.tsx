import { Suspense } from 'react'
import HomeClient from './HomeClient'

export default function HomePage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <HomeClient />
    </Suspense>
  )
}
