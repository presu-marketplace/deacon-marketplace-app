"use client"

import { useEffect, useState } from "react";
import Image from "next/image";

const backgroundImages = [
  "/home-services/painting.jpg",
  "/home-services/plumbing.jpg",
  "/home-services/cleaning.jpg",
  "/home-services/landscaping.jpg",
  "/home-services/electrical.jpg"
];

export default function UnderConstructionPage() {
  const [currentBg, setCurrentBg] = useState(0);
  const [locale, setLocale] = useState<'en' | 'es'>('en');

  useEffect(() => {
    const lang = navigator.language.startsWith("es") ? "es" : "en";
    setLocale(lang);

    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const t = {
    en: {
      title: "We're building something great!",
      subtitle: "This page is currently under construction. Please check back soon."
    },
    es: {
      title: "¡Estamos construyendo algo increíble!",
      subtitle: "Esta página está actualmente en construcción. Por favor, vuelve pronto."
    }
  }[locale];

  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0 transition-opacity duration-1000">
        <Image
          src={backgroundImages[currentBg]}
          alt="Home Service Background"
          fill
          style={{ objectFit: "cover", opacity: 0.4 }}
        />
      </div>

      {/* Overlay content */}
      <div className="relative z-10 text-center px-6 max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          {t.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          {t.subtitle}
        </p>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60 z-0" />
    </div>
  );
}
