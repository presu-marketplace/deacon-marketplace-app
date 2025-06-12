'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const heroImages = [
  '/images/hero-section/man-with-laptop-making-ok-sign.jpg',
  // '/images/professional-male-technician-wearing-goggles-head-protective-mask-gloves-tool-belt-holding-drilling-machine.jpg',
  // '/images/young-man-orange-t-shirt-wearing-rubber-gloves-holding-cleaning-spray-rug-looking-camera-with-smile-face-ready-clean-standing-purple-background.jpg'
]

interface HeroProps {
  t: Record<string, string>
}

export default function HeroSection({ t }: HeroProps) {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative w-full h-[580px] md:h-[740px] overflow-hidden">
      {/* Rotating background images */}
      {heroImages.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Hero ${index + 1}`}
          fill
          className={`absolute inset-0 object-cover object-[center_20%] transition-opacity duration-1000 ease-in-out ${
            index === currentImage ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        />
      ))}

      {/* Overlay content */}
      <div className="absolute bottom-[10%] sm:bottom-[15%] left-0 right-0 px-4 sm:px-6 flex justify-center text-white text-center z-20">
        <div className="bg-black/40 rounded-xl px-6 py-8 max-w-2xl w-full shadow-lg">
          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-snug whitespace-pre-line drop-shadow-md">
            {t.heroHeadline}
          </h1>

      {/* Search box */}
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full mt-6 shadow-md px-4 py-3 space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:items-center">
        {/* Main search input */}
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          aria-label={t.searchPlaceholder}
          className="flex-1 w-full px-4 py-2 text-gray-700 dark:text-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none rounded-md sm:rounded-full text-sm"
        />

        {/* Postal code */}
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM19.5 10.5C19.5 16 12 21 12 21S4.5 16 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <input
            type="text"
            defaultValue="1772"
            aria-label="Postal Code"
            className="bg-transparent w-16 text-sm focus:outline-none"
          />
        </div>

        {/* Search button */}
        <button
          className="w-full sm:w-auto flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md sm:rounded-full transition"
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387-1.414 1.414-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

        </div>
      </div>
    </section>
  )
}
