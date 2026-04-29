import Image from 'next/image'
import Link from 'next/link'
import { FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { IconType } from 'react-icons'

type FooterProps = {
  t: {
    terms: string
    privacy: string
    sitemap: string
    accessibility: string
    footerNote: string
    copyright: string
    address: string
  }
  locale: 'en' | 'es'
}

const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hola Presu, me gustaría obtener más información sobre sus servicios.'
)

const SOCIAL_LINKS: { href: string; label: string; icon: IconType }[] = [
  {
    href: 'https://instagram.com/presu_arg',
    label: 'Instagram',
    icon: FaInstagram,
  },
  {
    href: 'https://www.linkedin.com/company/presu',
    label: 'LinkedIn',
    icon: FaLinkedinIn,
  },
  {
    href: `https://wa.me/5491168112344?text=${WHATSAPP_MESSAGE}`,
    label: 'WhatsApp',
    icon: FaWhatsapp,
  },
]

export default function Footer({ t, locale }: FooterProps) {
  return (
    <footer className="bg-gray-50 border-t text-gray-600 text-sm px-6 py-10">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4">

        {/* Brand */}
        <div className="w-32">
          <Image
            src="/logo/presu-02.png"
            alt="Presu Logo"
            width={100}
            height={31}
            className="object-contain mx-auto"
          />
        </div>

        {/* Legal links */}
        <nav aria-label="Legal">
          <ul className="flex flex-wrap justify-center items-center divide-x divide-gray-400 text-xs text-gray-600">
            <li className="px-3">
              <Link href={`/cards/terms-of-use?lang=${locale}`} className="hover:underline">
                {t.terms}
              </Link>
            </li>
            <li className="px-3">
              <Link href={`/cards/privacy-policy?lang=${locale}`} className="hover:underline">
                {t.privacy}
              </Link>
            </li>
            <li className="px-3">
              <Link href={`/cards/sitemap?lang=${locale}`} className="hover:underline">
                {t.sitemap}
              </Link>
            </li>
            <li className="px-3">
              <Link href={`/cards/accessibility-tools?lang=${locale}`} className="hover:underline">
                {t.accessibility}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Social Icons */}
        <div className="flex gap-4 text-gray-500 mt-2">
          {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="hover:text-red-500"
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        {/* Address */}
        <a
          href="https://www.google.com/maps/place/Presu/@-34.5079335,-58.4806396,19z/data=!3m1!4b1!4m6!3m5!1s0x95bcb1dff8530871:0xaab622d59e6d44f0!8m2!3d-34.5079335!4d-58.4799945!16s%2Fg%2F11n3nbx95p"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 mt-2"
        >
          <HiOutlineLocationMarker className="w-4 h-4 shrink-0" />
          <span>{t.address}</span>
        </a>

        {/* Copyright */}
        <p className="text-xs text-gray-600 mt-4">
          &copy; {new Date().getFullYear()} PRESU. {t.copyright}
        </p>

        {/* Footer note */}
        <p className="text-[11px] text-gray-500 mt-1">{t.footerNote}</p>

      </div>
    </footer>
  )
}
