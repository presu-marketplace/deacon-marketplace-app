'use client'

interface TaglineSectionProps {
  t: Record<string, string>
}

export default function TaglineSection({ t }: TaglineSectionProps) {
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          fill="currentColor"
          className="w-6 h-6 text-blue-600"
          aria-hidden="true"
        >
          <path d="M190.15 98.15a8 8 0 0 1 0 11.31l-64 64a8 8 0 0 1-11.31 0l-32-32a8 8 0 0 1 11.31-11.31L120 156.69l58.34-58.34a8 8 0 0 1 11.31 0Z" />
        </svg>
      ),
      label: t.easy,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-blue-600"
          aria-hidden="true"
        >
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      label: t.fast,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          fill="currentColor"
          className="w-6 h-6 text-blue-600"
          aria-hidden="true"
        >
          <path d="M128 56a120.15 120.15 0 0 0-104.69 61.45 8 8 0 0 0 0 7.1A120.15 120.15 0 0 0 128 184a120.15 120.15 0 0 0 104.69-61.45 8 8 0 0 0 0-7.1A120.15 120.15 0 0 0 128 56Zm0 112a48 48 0 1 1 48-48 48.05 48.05 0 0 1-48 48Zm0-80a32 32 0 1 0 32 32 32 32 0 0 0-32-32Z" />
        </svg>
      ),
      label: t.transparent,
    },
  ]

  return (
    <section className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xl sm:text-2xl text-gray-800 dark:text-gray-200 font-semibold">
          {t.tagline}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-6">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300"
            >
              {f.icon}
              <span className="text-sm font-medium">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

