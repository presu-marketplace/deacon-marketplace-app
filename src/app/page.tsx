'use client'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col transition-colors duration-300">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow">
        <div className="flex items-center gap-2">
        <img
          src="/images/presu-logo.png"
          alt="PRESU logo"
          className="h-20 sm:h-24 lg:h-28 w-auto"
        />
        </div>
        <div className="flex gap-4">
          <button onClick={() => router.push('/auth/login')} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            Login
          </button>
          <button
            onClick={() => router.push('/auth/register')}
            className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center max-w-xl animate-fade-in duration-700">
          <h2 className="text-4xl font-bold mb-4">
            Get Services. Compare Quotes. Choose Smart.
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            PRESU is your go-to platform to request services and receive transparent quotes from trusted providers.
          </p>
          <button
            onClick={() => router.push('/auth/register')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-lg"
          >
            Join Now
          </button>
        </div>
      </main>

      {/* How It Works */}
      <section className="bg-white dark:bg-gray-800 py-12 px-6 text-center transition-colors">
        <h3 className="text-2xl font-semibold mb-6">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-6 text-gray-700 dark:text-gray-200">
          <div>
            <h4 className="font-bold text-lg mb-2">1. Request a Service</h4>
            <p>Tell us what you need. Add details, location, and photos.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-2">2. Receive Quotes</h4>
            <p>Providers send quotes. Compare pricing and reviews.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-2">3. Choose & Proceed</h4>
            <p>Select your provider and manage everything online.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
        &copy; {new Date().getFullYear()} PRESU. All rights reserved.
      </footer>
    </div>
  )
}
