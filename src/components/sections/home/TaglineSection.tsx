'use client'

import { motion } from 'framer-motion'

interface TaglineSectionProps {
  t: Record<string, string>
}

export default function TaglineSection({ t }: TaglineSectionProps) {
  const features = [
    {
      key: 'easy',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M190.15 98.15a8 8 0 0 1 0 11.31l-64 64a8 8 0 0 1-11.31 0l-32-32a8 8 0 0 1 11.31-11.31L120 156.69l58.34-58.34a8 8 0 0 1 11.31 0Z" />
        </svg>
      ),
      label: t.easy,
    },
    {
      key: 'fast',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      label: t.fast,
    },
    {
      key: 'transparent',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M128 56a120.15 120.15 0 0 0-104.69 61.45 8 8 0 0 0 0 7.1A120.15 120.15 0 0 0 128 184a120.15 120.15 0 0 0 104.69-61.45 8 8 0 0 0 0-7.1A120.15 120.15 0 0 0 128 56Zm0 112a48 48 0 1 1 48-48 48.05 48.05 0 0 1-48 48Zm0-80a32 32 0 1 0 32 32 32 32 0 0 0-32-32Z" />
        </svg>
      ),
      label: t.transparent,
    },
  ]

  // Animation variants
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  }

  const rise = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <section className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl text-center">
      <motion.p
  className="text-xl sm:text-2xl md:text-2xl font-semibold leading-relaxed text-gray-500"
>
  {t.tagline.split(" ").map((word, i) => (
    <motion.span
      key={i}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: i * 0.05 }}
      viewport={{ once: true }}
      className="inline-block mr-1"
    >
      {word}
    </motion.span>
  ))}
</motion.p>

        <motion.div
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={container}
        >
          {features.map((f) => (
            <motion.span
              key={f.key}
              variants={rise}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2
                         bg-gray-50 text-gray-700 text-sm font-medium
                         hover:bg-gray-100 transition-colors"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-700">
                {f.icon}
              </span>
              {f.label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
