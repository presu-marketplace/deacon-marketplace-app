'use client'

import { useEffect, useState } from 'react'

interface NominatimAddress {
  suburb?: string;
  neighbourhood?: string;
  city_district?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  country?: string;
  // Add more fields if needed based on API response variations
}

interface LocationPromptProps {
  t: Record<string, string>
  setUserAddress: (address: string) => void
}

export default function LocationPrompt({ t, setUserAddress }: LocationPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const hasPrompted = sessionStorage.getItem('locationPrompted')
    const existingAddress = localStorage.getItem('userAddress')

    if (!hasPrompted && !existingAddress) {
      setShowPrompt(true)
    }
  }, [])

  const extractSmartLocation = (address: NominatimAddress): string => {
    return (
      address?.suburb ||
      address?.neighbourhood ||
      address?.city_district ||
      address?.city ||
      address?.town ||
      address?.village ||
      address?.state ||
      address?.country ||
      t.locationFallback || 'Your location'
    )
  }

  const handleAllow = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
          const data = await res.json()

          const locationLabel = extractSmartLocation(data.address)
          const capitalizeWords = (text: string) =>
            text.replace(/\b\w/g, (c) => c.toUpperCase())

          setUserAddress(capitalizeWords(locationLabel))
          localStorage.setItem('userAddress', capitalizeWords(locationLabel))

        } catch (error) {
          console.error('Reverse geocoding failed:', error)
          setUserAddress(t.locationFallback || 'Your location')
        }

        sessionStorage.setItem('locationPrompted', 'true')
        setShowPrompt(false)
      },
      (error) => {
        console.warn('Location access denied:', error)
        sessionStorage.setItem('locationPrompted', 'true')
        setShowPrompt(false)
      }
    )
  }

  const handleDismiss = () => {
    sessionStorage.setItem('locationPrompted', 'true')
    setShowPrompt(false)
  }

  const handleManualInput = () => {
    const manual = prompt(t.manualLocationPrompt || 'Enter your location:')
    if (manual?.trim()) {
      const capitalizeWords = (text: string) =>
        text.replace(/\b\w/g, (c) => c.toUpperCase())

      const cleaned = capitalizeWords(manual.trim())
      setUserAddress(cleaned)
      localStorage.setItem('userAddress', cleaned)
    }
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm text-center shadow-xl relative">
        <button
          className="absolute top-4 left-4 text-black text-lg"
          onClick={handleDismiss}
          aria-label="Close"
        >
          ×
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-xl bg-[#e5f5ed] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-green-700"
              viewBox="0 0 256 256"
              fill="currentColor"
            >
              <path d="M128 16A88.1 88.1 0 0 0 40 104c0 66.14 80.18 131.39 83.6 134a8 8 0 0 0 8.8 0C135.82 235.39 216 170.14 216 104A88.1 88.1 0 0 0 128 16Zm0 112a24 24 0 1 1 24-24 24 24 0 0 1-24 24Z" />
            </svg>
          </div>
        </div>

        <h2 className="text-[22px] font-bold text-black mb-2">
          {t.allowLocationTitle || 'Allow your location'}
        </h2>

        <p className="text-sm text-gray-700 mb-6">
          {t.allowLocationDescription || 'Skip the typing and see services near you'}
        </p>

        <button
          onClick={handleAllow}
          className="w-full bg-black text-white rounded-lg py-3 font-medium text-sm hover:bg-gray-900 mb-4"
        >
          {t.allowButton || 'Allow'}
        </button>

        <button
          onClick={handleManualInput}
          className="text-sm text-black font-medium underline"
        >
          {t.typeAddressInstead || 'Type in service address instead'}
        </button>
      </div>
    </div>
  )
}
