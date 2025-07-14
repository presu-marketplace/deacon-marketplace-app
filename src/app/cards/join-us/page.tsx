import { Suspense } from 'react'
import JoinUsClient from './JoinUsClient'

export default function JoinUsPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <JoinUsClient />
    </Suspense>
  )
}
