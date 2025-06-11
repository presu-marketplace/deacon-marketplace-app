"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function UnderConstructionPage() {
  const [locale, setLocale] = useState<"en" | "es">("en");

  useEffect(() => {
    const lang = navigator.language.startsWith("es") ? "es" : "en";
    setLocale(lang);
  }, []);

  const t = {
    en: {
      title: "We're building something great!",
      subtitle: "This page is currently under construction. Please check back soon.",
      contact: "Contact us at"
    },
    es: {
      title: "¡Estamos construyendo algo increíble!",
      subtitle: "Esta página está actualmente en construcción. Por favor, vuelve pronto.",
      contact: "Contáctanos en"
    }
  }[locale];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white text-center px-6 bg-gradient-to-br from-gray-900 via-[#1a1a2e] to-[#16213e] animate-fadeIn relative">
      {/* Logo with hover scale-up */}
      <div className="mb-10 transition-transform duration-500 hover:scale-105">
        <Image
          src="/logo/presu-02.png"
          alt="Presu Logo"
          width={320}
          height={100}
          className="opacity-100"
        />
      </div>

      {/* Title & Subtitle */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
        {t.title}
      </h1>
      <p className="text-lg sm:text-xl text-gray-300 max-w-md mx-auto">
        {t.subtitle}
      </p>

      {/* Footer */}
      <footer className="absolute bottom-4 text-sm text-gray-400">
        {t.contact}{" "}
        <a href="mailto:hello@presu.com" className="underline hover:text-white">
          hello@presu.com
        </a>
      </footer>
    </div>
  );
}
