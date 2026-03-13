export function getFooterTranslations(locale: 'en' | 'es') {
  return {
    terms: locale === 'es' ? 'Términos de uso' : 'Terms of Use',
    privacy: locale === 'es' ? 'Política de privacidad' : 'Privacy Policy',
    sitemap: locale === 'es' ? 'Mapa del sitio' : 'Sitemap',
    accessibility: locale === 'es' ? 'Accesibilidad' : 'Accessibility',
    footerNote:
      locale === 'es'
        ? 'No vender ni compartir mi información personal'
        : 'Do Not Sell or Share My Personal Information',
    copyright:
      locale === 'es'
        ? 'Todos los derechos reservados.'
        : 'All rights reserved.',
    address:
      locale === 'es'
        ? 'Av. del Libertador 2442 4° Piso, B1636 Olivos, Provincia de Buenos Aires.'
        : '2442 Del Libertador Ave., 4th Floor, B1636 Olivos, Buenos Aires Province.',
  }
}
