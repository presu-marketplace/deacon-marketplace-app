import { Suspense } from 'react'
import SitemapClient from './SitemapClient'

export default function SitemapPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <SitemapClient />
    </Suspense>
  )
}
