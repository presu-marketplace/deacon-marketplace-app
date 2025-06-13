type HowItWorksSectionProps = {
  locale: 'en' | 'es'
}

export default function HowItWorksSection({ locale }: HowItWorksSectionProps) {
  return (
    <section className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-6">
        {locale === 'es' ? 'Cómo funciona Presu' : 'How Presu Works'}
      </h2>
      <p className="text-gray-700 text-lg mb-12">
        {locale === 'es'
          ? 'Presu te permite comparar presupuestos, contactar proveedores y tomar decisiones informadas para cada necesidad.'
          : 'Presu lets you compare quotes, contact providers, and make informed decisions for every need.'}
      </p>

      {/* Placeholder for steps or more sections */}
    </section>
  )
}
