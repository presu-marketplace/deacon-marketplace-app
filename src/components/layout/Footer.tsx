import Image from 'next/image'
import Link from 'next/link'

type FooterProps = {
  t: {
    terms: string
    privacy: string
    sitemap: string
    accessibility: string
    footerNote: string
    copyright: string
  }
  locale: 'en' | 'es'
}

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
          priority
        />
      </div>


        {/* Legal links */}
        <ul className="flex flex-wrap justify-center items-center gap-3 text-xs text-gray-600">
          <li>
            <Link href={`/cards/terms-of-use?lang=${locale}`} className="hover:underline">
              {t.terms}
            </Link>
          </li>
          <li>|</li>
          <li>
            <Link href={`/cards/privacy-policy?lang=${locale}`} className="hover:underline">
              {t.privacy}
            </Link>
          </li>
          <li>|</li>
          <li>
            <Link href={`/cards/sitemap?lang=${locale}`} className="hover:underline">
              {t.sitemap}
            </Link>
          </li>
          <li>|</li>
          <li>
            <Link href={`/cards/accessibility-tools?lang=${locale}`} className="hover:underline">
              {t.accessibility}
            </Link>
          </li>
        </ul>

        {/* Social Icons */}
        <div className="flex gap-4 text-gray-500 mt-2">
          <a href="https://instagram.com/presu_arg" className="hover:text-red-500" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512">
              <path d="M224.1 141c-63.6 0-115.1 51.5-115.1 115.1S160.5 371.2 224.1 371.2 339.2 319.7 339.2 256 287.7 141 224.1 141zm0 190.2c-41.5 0-75.1-33.6-75.1-75.1s33.6-75.1 75.1-75.1 75.1 33.6 75.1 75.1-33.6 75.1-75.1 75.1zm146.4-194.3c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-.9-19.6-5.2-37-19.1-51C405.2 90.3 387.7 86 368.1 85.1c-27.2-1.2-108.9-1.2-136.1 0-19.6.9-37 5.2-51 19.1s-18.2 31.4-19.1 51c-1.2 27.2-1.2 108.9 0 136.1.9 19.6 5.2 37 19.1 51s31.4 18.2 51 19.1c27.2 1.2 108.9 1.2 136.1 0 19.6-.9 37-5.2 51-19.1s18.2-31.4 19.1-51c1.2-27.2 1.2-108.9 0-136.1zM398.8 388c-7.8 19.5-22.9 34.6-42.4 42.4-29.4 11.7-99.2 9-132.4 9s-103 .7-132.4-9c-19.5-7.8-34.6-22.9-42.4-42.4-11.7-29.4-9-99.2-9-132.4s-.7-103 9-132.4c7.8-19.5 22.9-34.6 42.4-42.4C121.6 58.2 191.4 60.9 224.6 60.9s103-.7 132.4 9c19.5 7.8 34.6 22.9 42.4 42.4 11.7 29.4 9 99.2 9 132.4s.6 103-9 132.4z"/>
            </svg>
          </a>
          <a href="https://linkedin.com/in/presu-arg-226101371" className="hover:text-red-500" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512">
              <path d="M100.28 448H7.4V148.9h92.88zm-46.44-340c-29.7 0-53.74-24.15-53.74-53.74C0 24.15 24.04 0 53.84 0s53.74 24.15 53.74 53.74c-.01 29.59-24.05 53.74-53.74 53.74zM447.9 448h-92.4V302.4c0-34.7-12.5-58.4-43.6-58.4-23.8 0-38.1 16-44.3 31.4-2.3 5.5-2.8 13.2-2.8 20.9V448h-92.6s1.2-270.4 0-298.1h92.6v42.3c-.2.3-.5.7-.7 1h.7v-1c12.3-18.9 34.4-45.8 83.7-45.8 61.2 0 107.1 39.9 107.1 125.5V448z"/>
            </svg>
          </a>
        </div>

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
