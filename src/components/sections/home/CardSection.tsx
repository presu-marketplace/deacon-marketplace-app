'use client'

import Image from 'next/image'
import card1Img from '@/assets/images/card-section/card-01.jpg'
import card2Img from '@/assets/images/card-section/card-02.jpg'
import card3Img from '@/assets/images/card-section/card-03.jpg'
import Link from 'next/link'

type CardSectionProps = {
  t: Record<string, string>
  locale: 'en' | 'es'
}

export default function CardSection({ locale }: CardSectionProps) {
  return (
    <section className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Card 1 */}
        <Link href="/cards/market-comparison" className="w-full group">
          <div className="cursor-pointer">
            <Image
              src={card1Img}
              alt={locale === 'es' ? "Comparativa de mercado" : "Market Comparison"}
              width={1200}
              height={800}
              quality={100}
              placeholder="blur"
              priority
              className="rounded-lg w-full h-[320px] object-cover group-hover:brightness-95 transition"
            />
            <h3 className="text-lg font-bold mt-4 text-left text-gray-900 group-hover:text-black transition">
              {locale === 'es' ? "Comparativa de mercado" : "Market Comparison"}
            </h3>
            <p className="text-sm mt-2 text-gray-700 group-hover:text-black transition">
              {locale === 'es' ? (
                <>Optimizá tus decisiones de compras con <span className="font-medium text-black">Presu</span>, somos la mejor forma de comparar precios de mercado. Ahorrá tiempo, dinero y tomá decisiones estratégicas que impulsen el crecimiento de tu negocio.</>
              ) : (
                <>Optimize your purchasing decisions with <span className="font-medium text-black">Presu</span> — we’re the best way to compare market prices. Save time, money, and make strategic decisions that drive your business growth.</>
              )}
            </p>
            <span className="text-sm underline mt-2 inline-block text-gray-800 group-hover:text-black transition">
              {locale === 'es' ? "Ver cómo funciona" : "See how it works"}
            </span>
          </div>
        </Link>

        {/* Card 2 */}
        <Link href="/cards/join-us" className="w-full group">
          <div className="cursor-pointer">
            <Image
              src={card2Img}
              alt={locale === 'es' ? "Sé parte de Presu" : "Join Presu"}
              width={1200}
              height={800}
              quality={100}
              placeholder="blur"
              priority
              className="rounded-lg w-full h-[320px] object-cover group-hover:brightness-95 transition"
            />
            <h3 className="text-lg font-bold mt-4 text-left text-gray-900 group-hover:text-black transition">
              {locale === 'es' ? "Sé parte de Presu!" : "Join Presu!"}
            </h3>
            <p className="text-sm mt-2 text-gray-700 group-hover:text-black transition">
            {locale === 'es' ? (
              <>Estamos revolucionando la forma en que los consumidores encuentran y comparan presupuestos para diversos servicios, queremos que seas parte de esta innovación.</>
            ) : (
              <>
                We{"'"}re revolutionizing the way consumers find and compare quotes for a wide range of services — and we want you to be part of this innovation.
              </>
            )}
            </p>
            <span className="text-sm underline mt-2 inline-block text-gray-800 group-hover:text-black transition">
              {locale === 'es' ? "¿Qué buscamos en nuestros proveedores?" : "What do we look for in providers?"}
            </span>
          </div>
        </Link>

        {/* Card 3 */}
        <Link href="/cards/sustainability" className="w-full group">
          <div className="w-full cursor-pointer">
            <Image
              src={card3Img}
              alt={locale === 'es' ? "Sustentabilidad en Presu" : "Sustainability at Presu"}
              width={1200}
              height={800}
              quality={100}
              placeholder="blur"
              priority
              className="rounded-lg w-full h-[320px] object-cover"
            />
            <h3 className="text-lg font-bold mt-4 text-left text-gray-900">
              {locale === 'es' ? "Comprometidos con la sostenibilidad" : "Committed to Sustainability"}
            </h3>
            <p className="text-sm mt-2 text-gray-700">
            {locale === 'es' ? (
              <>
                Creemos que la innovación digital debe ir de la mano con la responsabilidad ambiental y social. Estamos comprometidos con la sustentabilidad y el medio ambiente. 
              </>
            ) : (
              <>
                We believe that digital innovation must go hand in hand with environmental and social responsibility. We are committed to sustainability and protecting the environment.
              </>
            )}
            </p>
            <span className="text-sm underline mt-2 inline-block text-gray-800 group-hover:text-black transition">
              {locale === 'es' ? "Conocé nuestro compromiso" : "Learn about our commitment"}
            </span>
          </div>
        </Link>

      </div>
    </section>
  )
}
