export const NAV_DICT = {
  en: {
    login: 'Log in',
    signup: 'Sign up',
    searchPlaceholder: 'Search service...',
    language: 'English',
    joinAsPro: 'Join as provider',
    howItWorks: 'How Presu Works',
    home: 'Home',
    legal: 'Legal',
  },
  es: {
    login: 'Iniciar sesión',
    signup: 'Crear cuenta',
    searchPlaceholder: 'Buscar servicio...',
    language: 'Español',
    joinAsPro: 'Unirse como proveedor',
    howItWorks: 'Cómo funciona Presu',
    home: 'Inicio',
    legal: 'Legal',
  },
} as const

export const HELP_DICT = {
  en: {
    skip: 'Skip to main content',
    title: 'Help & Contact',
    intro: 'Find answers or reach out to us.',
    breadcrumbLabel: 'Breadcrumb',
    contactHeading: 'Contact',
    contactDescription: 'Send us an email at',
    contactMailSubject: 'Presu support',
    faqHeading: 'Frequently Asked Questions',
    faqs: [
      {
        question: 'How do I become a provider?',
        answer: 'Sign up and complete your profile to join as a provider.',
      },
      {
        question: 'Where can I view my activity?',
        answer: 'Visit the activity page.',
      },
    ],
    quickLinksHeading: 'Quick Links',
    quickLinks: [
      { href: '/cards/terms-of-use', label: 'Terms of Use' },
      { href: '/cards/privacy-policy', label: 'Privacy Policy' },
      { href: '/cards/accessibility-tools', label: 'Accessibility Tools' },
    ],
    lastUpdatedLabel: 'Last updated',
  },
  es: {
    skip: 'Saltar al contenido principal',
    title: 'Ayuda y Contacto',
    intro: 'Encontrá respuestas o escribinos.',
    breadcrumbLabel: 'Ruta de navegación',
    contactHeading: 'Contacto',
    contactDescription: 'Envíanos un correo a',
    contactMailSubject: 'Soporte Presu',
    faqHeading: 'Preguntas frecuentes',
    faqs: [
      {
        question: '¿Cómo me hago proveedor?',
        answer: 'Registrate y completá tu perfil para unirte como proveedor.',
      },
      {
        question: '¿Dónde puedo ver mi actividad?',
        answer: 'Ingresá a la página de actividad.',
      },
    ],
    quickLinksHeading: 'Enlaces rápidos',
    quickLinks: [
      { href: '/cards/terms-of-use', label: 'Términos de uso' },
      { href: '/cards/privacy-policy', label: 'Política de privacidad' },
      { href: '/cards/accessibility-tools', label: 'Herramientas de accesibilidad' },
    ],
    lastUpdatedLabel: 'Última actualización',
  },
} as const

export type HelpLocale = keyof typeof HELP_DICT
