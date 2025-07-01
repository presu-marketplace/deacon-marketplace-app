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
              <>Tomá mejores decisiones con <span className="font-medium text-black">Presu</span> — compará precios, ahorrá tiempo y dinero, y hacé crecer tu negocio.</>
            ) : (
              <>Make better decisions with <span className="font-medium text-black">Presu</span> — compare prices, save time and money, and grow your business.</>
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
              <>Formá parte de la <span className="font-medium text-black">red</span> que <span className="font-medium text-black">conecta proveedores</span> con nuevos <span className="font-medium text-black">clientes</span>.
                Compará presupuestos, mostrá tus servicios y crecé con nosotros.</>
            ) : (
              <>
                Join the <span className="font-medium text-black">network</span> that <span className="font-medium text-black">connects providers</span> with new <span className="font-medium text-black">clients</span>.
                Compare quotes, showcase your services, and grow with us.
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
                Creemos que la <span className="font-medium text-black">innovación digital</span> debe ir de la mano con la responsabilidad ambiental y social. 
                Estamos <span className="font-medium text-black">comprometidos</span> con la sustentabilidad y el <span className="font-medium text-black">medio ambiente</span>.
              </>
            ) : (
              <>
                We believe that <span className="font-medium text-black">digital innovation</span> should go hand in hand with environmental and social responsibility.
                We are <span className="font-medium text-black">committed</span> to sustainability and the <span className="font-medium text-black">environment</span>.
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
