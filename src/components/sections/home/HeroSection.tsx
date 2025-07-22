'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const heroImages = [
  '/images/hero-section/card-01.jpg',
  '/images/hero-section/card-02.jpg',
  '/images/hero-section/card-03.jpg',
]

interface HeroProps {
  t: Record<string, string>
  userAddress: string | null
  locale: 'en' | 'es'
}

export default function HeroSection({ t, userAddress, locale }: HeroProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('q', searchTerm)
    if (userAddress) params.set('location', userAddress)
    if (locale) params.set('lang', locale)
    router.push(`/services?${params.toString()}`)
  }

  const handleIconClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  return (
    <section className="relative w-full h-[580px] md:h-[740px] overflow-hidden">
      {/* Rotating background images */}
      {heroImages.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Hero ${index + 1}`}
          fill
          className={`absolute inset-0 object-cover object-[center_20%] transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        />
      ))}

      {/* Overlay content */}
      <div className="absolute bottom-[10%] sm:bottom-[15%] left-0 right-0 px-4 sm:px-6 flex justify-center text-white text-center z-20">
        <div className="bg-black/20 rounded-2xl px-8 py-10 w-full max-w-4xl shadow-lg">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold leading-snug drop-shadow-md select-none">
            {t.heroHeadline}
          </h1>

          {/* Mobile layout */}
          <div className="w-full mt-8 flex flex-col sm:hidden items-center gap-3">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow w-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-5 h-5 text-gray-500 mr-2 cursor-pointer" 
                viewBox="0 0 256 256" 
                fill="currentColor"
                onClick={handleIconClick}
              >
                <path d="M229.66 218.34l-50.07-50.06a88.11 88.11 0 10-11.31 11.31l50.06 50.07a8 8 0 0011.32-11.32zM40 112a72 72 0 1172 72 72.08 72.08 0 01-72-72z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder}
                className="flex-1 text-sm text-gray-800 bg-transparent focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="ml-2 p-2 rounded-full hover:bg-gray-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M128 16A88.1 88.1 0 0 0 40 104c0 66.14 80.18 131.39 83.6 134a8 8 0 0 0 8.8 0C135.82 235.39 216 170.14 216 104A88.1 88.1 0 0 0 128 16Zm0 112a24 24 0 1 1 24-24 24 24 0 0 1-24 24Z" />
                </svg>
              </button>
            </div>
            <button onClick={handleSearch} className="bg-black text-white rounded-full px-6 py-2 text-sm font-medium shadow hover:bg-gray-900 transition">
              {t.searchHere}
            </button>
          </div>

          {/* Desktop layout */}
          <div className="hidden sm:flex w-full flex-row justify-center percursor-pointeritems-center gap-4 mt-8">
            <div className="flex items-center bg-white rounded-full px-4 py-3 shadow w-full max-w-md">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-5 h-5 text-gray-500 mr-3 cursor-pointer" 
                viewBox="0 0 256 256" 
                fill="currentColor"
                onClick={handleIconClick}
              >
                <path d="M229.66 218.34l-50.07-50.06a88.11 88.11 0 10-11.31 11.31l50.06 50.07a8 8 0 0011.32-11.32zM40 112a72 72 0 1172 72 72.08 72.08 0 01-72-72z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder}
                className="flex-1 text-sm text-gray-800 bg-transparent focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-white rounded-full px-5 py-3 shadow text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" viewBox="0 0 256 256" fill="currentColor">
                <path d="M128 16A88.1 88.1 0 0 0 40 104c0 66.14 80.18 131.39 83.6 134a8 8 0 0 0 8.8 0C135.82 235.39 216 170.14 216 104A88.1 88.1 0 0 0 128 16Zm0 112a24 24 0 1 1 24-24 24 24 0 0 1-24 24Z" />
              </svg>
              <span className="text-gray-700 truncate max-w-[180px]">{userAddress ?? t.location}</span>
            </button>
            <button onClick={handleSearch} className="bg-black text-white rounded-full px-6 py-3 text-sm font-medium shadow hover:bg-gray-900 transition">
              {t.searchHere}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}