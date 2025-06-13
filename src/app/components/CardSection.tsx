'use client'

import Image from 'next/image'
import card1Img from '@/app/assets/images/card-section/card-01.jpg'
import card2Img from '@/app/assets/images/card-section/card-02.jpg'
import card3Img from '@/app/assets/images/card-section/card-03.jpg'

type CardSectionProps = {
  t: Record<string, string>
  locale: 'en' | 'es'
}

export default function CardSection({ locale }: CardSectionProps) {
  return (
    <section className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Card 1 */}
        <div className="w-full">
          <Image
            src={card1Img}
            alt={locale === 'es' ? "Comparativa de mercado" : "Market Comparison"}
            width={1200}
            height={800}
            quality={100}
            placeholder="blur"
            priority
            className="rounded-lg w-full h-[320px] object-cover"
          />
          <h3 className="text-lg font-bold mt-4 text-left text-gray-900">
            {locale === 'es' ? "Comparativa de mercado" : "Market Comparison"}
          </h3>
          <p className="text-sm mt-2 text-gray-700">
            {locale === 'es' ? (
              <>Optimizá tus decisiones de compra con <span className="font-medium text-black">Presu</span>, accedé a presupuestos actualizados y proveedores confiables para ahorrar tiempo y costos.</>
            ) : (
              <>Optimize your purchasing decisions with <span className="font-medium text-black">Presu</span>. Access up-to-date quotes and trusted providers to save time and reduce costs.</>
            )}
          </p>
          <a href="#" className="text-sm underline mt-2 inline-block text-gray-800 hover:text-black">
            {locale === 'es' ? "Ver cómo funciona" : "See how it works"}
          </a>
        </div>

        {/* Card 2 */}
        <div className="w-full">
          <Image
            src={card2Img}
            alt={locale === 'es' ? "Unite a Presu" : "Join Presu"}
            width={1200}
            height={800}
            quality={100}
            placeholder="blur"
            priority
            className="rounded-lg w-full h-[320px] object-cover"
          />
          <h3 className="text-lg font-bold mt-4 text-left text-gray-900">
            {locale === 'es' ? "Conectá con nuevos clientes" : "Connect with New Clients"}
          </h3>
          <p className="text-sm mt-2 text-gray-700">
            {locale === 'es' ? (
              <>Unite a <span className="font-medium text-black">Presu</span> y recibí pedidos de usuarios que buscan servicios como el tuyo. Promovemos transparencia, sustentabilidad y relaciones duraderas.</>
            ) : (
              <>Join <span className="font-medium text-black">Presu</span> and receive requests from users looking for services like yours. We promote transparency, sustainability, and lasting relationships.</>
            )}
          </p>
          <a href="#" className="text-sm underline mt-2 inline-block text-gray-800 hover:text-black">
            {locale === 'es' ? "¿Qué buscamos en nuestros proveedores?" : "What do we look for in providers?"}
          </a>
        </div>

        {/* Card 3 */}
        <div className="w-full">
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
              <>En <span className="font-medium text-black">Presu</span>, digitalizamos procesos para reducir el uso de papel y energía, conectamos con proveedores responsables y promovemos un consumo más consciente.</>
            ) : (
              <>At <span className="font-medium text-black">Presu</span>, we digitize processes to reduce paper and energy use, connect with responsible providers, and promote more conscious consumption.</>
            )}
          </p>
          <a href="#" className="text-sm underline mt-2 inline-block text-gray-800 hover:text-black">
            {locale === 'es' ? "Conocé nuestro compromiso" : "Learn about our commitment"}
          </a>
        </div>

      </div>
    </section>
  )
}
