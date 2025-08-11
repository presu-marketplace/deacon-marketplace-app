import { Suspense } from 'react'
import SettingsPage from './SettingsPageClient'

export default function Page() {
  return (
    <Suspense fallback={<div className="pt-32 px-6">Loading…</div>}>
      <SettingsPage />
    </Suspense>
  )
}
