import Image from 'next/image'

type FooterProps = {
  t: {
    terms: string
    privacy: string
    sitemap: string
    accessibility: string
    footerNote: string
    copyright: string
  }
}

export default function Footer({ t }: FooterProps) {
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
          <li><a href="#" className="hover:underline">{t.terms}</a></li>
          <li>|</li>
          <li><a href="#" className="hover:underline">{t.privacy}</a></li>
          <li>|</li>
          <li><a href="#" className="hover:underline">{t.sitemap}</a></li>
          <li>|</li>
          <li><a href="#" className="hover:underline">{t.accessibility}</a></li>
        </ul>

        {/* Social Icons */}
        <div className="flex gap-4 text-gray-500 mt-2">
          <a href="#" className="hover:text-red-500" aria-label="Twitter">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.72 9.72 0 01-2.88 1.1A4.48 4.48 0 0016.5 0c-2.48 0-4.5 2.02-4.5 4.5 0 .35.04.69.11 1.02C8.09 5.42 4.29 3.6 1.67.87A4.48 4.48 0 00.9 3.13c0 1.55.79 2.92 2 3.72a4.48 4.48 0 01-2.04-.56v.06c0 2.17 1.54 3.98 3.6 4.39a4.52 4.52 0 01-2.03.08c.57 1.78 2.23 3.07 4.2 3.11a9 9 0 01-5.58 1.92c-.36 0-.71-.02-1.06-.06A12.76 12.76 0 006.93 21c8.28 0 12.8-6.86 12.8-12.8 0-.19 0-.39-.01-.58A9.2 9.2 0 0023 3z"/>
            </svg>
          </a>
          <a href="#" className="hover:text-red-500" aria-label="Instagram">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512">
              <path d="M224.1 141c-63.6 0-115.1 51.5-115.1 115.1S160.5 371.2 224.1 371.2 339.2 319.7 339.2 256 287.7 141 224.1 141zm0 190.2c-41.5 0-75.1-33.6-75.1-75.1s33.6-75.1 75.1-75.1 75.1 33.6 75.1 75.1-33.6 75.1-75.1 75.1zm146.4-194.3c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-.9-19.6-5.2-37-19.1-51C405.2 90.3 387.7 86 368.1 85.1c-27.2-1.2-108.9-1.2-136.1 0-19.6.9-37 5.2-51 19.1s-18.2 31.4-19.1 51c-1.2 27.2-1.2 108.9 0 136.1.9 19.6 5.2 37 19.1 51s31.4 18.2 51 19.1c27.2 1.2 108.9 1.2 136.1 0 19.6-.9 37-5.2 51-19.1s18.2-31.4 19.1-51c1.2-27.2 1.2-108.9 0-136.1zM398.8 388c-7.8 19.5-22.9 34.6-42.4 42.4-29.4 11.7-99.2 9-132.4 9s-103 .7-132.4-9c-19.5-7.8-34.6-22.9-42.4-42.4-11.7-29.4-9-99.2-9-132.4s-.7-103 9-132.4c7.8-19.5 22.9-34.6 42.4-42.4C121.6 58.2 191.4 60.9 224.6 60.9s103-.7 132.4 9c19.5 7.8 34.6 22.9 42.4 42.4 11.7 29.4 9 99.2 9 132.4s.6 103-9 132.4z"/>
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
