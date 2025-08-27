import { Suspense } from 'react'
import HelpClient from './HelpClient'

export default function HelpPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <HelpClient />
    </Suspense>
  )
}
