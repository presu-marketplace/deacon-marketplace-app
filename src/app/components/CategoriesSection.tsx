'use client'

import { Wrench, Tree, Toilet, Lightning, PaintBrush, House, Hammer, Broom, Fan, WindowsLogo, Wall, Devices } from '@phosphor-icons/react'

type CategoriesSectionProps = {
  t: Record<string, string>
}

export default function CategoriesSection({ t }: CategoriesSectionProps) {
  const categories = [
    { name: t.handyperson, icon: <Wrench size={28} weight="duotone" className="text-red-500" /> },
    { name: t.landscaping, icon: <Tree size={28} weight="duotone" className="text-green-600" /> },
    { name: t.plumbing, icon: <Toilet size={28} weight="duotone" className="text-blue-500" /> },
    { name: t.electrical, icon: <Lightning size={28} weight="duotone" className="text-yellow-500" /> },
    { name: t.remodeling, icon: <Hammer size={28} weight="duotone" className="text-gray-600" /> },
    { name: t.roofing, icon: <House size={28} weight="duotone" className="text-purple-600" /> },
    { name: t.painting, icon: <PaintBrush size={28} weight="duotone" className="text-pink-600" /> },
    { name: t.cleaning, icon: <Broom size={28} weight="duotone" className="text-cyan-600" /> },
    { name: t.hvac, icon: <Fan size={28} weight="duotone" className="text-sky-500" /> },
    { name: t.windows, icon: <WindowsLogo size={28} weight="duotone" className="text-indigo-500" /> },
    { name: t.concrete, icon: <Wall size={28} weight="duotone" className="text-gray-500" /> },
    { name: t.applianceRepair, icon: <Devices size={28} weight="duotone" className="text-lime-500" /> }
  ]

  return (
    <section id="how-it-works" className="px-4 py-8 border-b bg-gray-950">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center text-xs">
        {categories.map((cat, i) => (
          <div
            key={i}
            aria-label={cat.name}
            className="rounded-md bg-gray-900 p-3 hover:shadow-lg transition flex flex-col items-center gap-1 text-white"
          >
            {cat.icon}
            <span>{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
