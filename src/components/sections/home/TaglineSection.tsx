'use client'

interface TaglineSectionProps {
  t: Record<string, string>
}

export default function TaglineSection({ t }: TaglineSectionProps) {
  return (
    <section className="w-full bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-lg sm:text-xl text-gray-800 dark:text-gray-200">
          {t.tagline}
        </p>
      </div>
    </section>
  )
}

