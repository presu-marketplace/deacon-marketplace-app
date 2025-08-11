import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4 text-gray-100">
      <Link href="/" className="mb-8" aria-label="Home">
        <Image src="/logo/presu-03.png" alt="Presu logo" width={120} height={40} priority />
      </Link>
      {children}
    </div>
  )
}
