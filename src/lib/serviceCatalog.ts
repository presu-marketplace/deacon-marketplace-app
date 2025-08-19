export type Service = {
  slug: string;
  name_es: string;
  name_en: string;
  image_url: string;
  rating?: number;
  schedule?: string;
  disabled?: boolean;
};

export const upcomingServices: Service[] = [
  {
    slug: 'auditing',
    name_es: 'Auditoría',
    name_en: 'Auditing',
    image_url: '/images/services/auditing.jpg',
    disabled: true,
  },
  {
    slug: 'merchandising',
    name_es: 'Merchandising',
    name_en: 'Merchandising',
    image_url: '/images/services/merchandising.jpg',
    disabled: true,
  },
  {
    slug: 'influencer',
    name_es: 'Influencer',
    name_en: 'Influencer',
    image_url: '/images/services/influencer.jpg',
    disabled: true,
  },
  {
    slug: 'logistics',
    name_es: 'Logística',
    name_en: 'Logistics',
    image_url: '/images/services/logistics.jpg',
    disabled: true,
  },
  {
    slug: 'maintenance',
    name_es: 'Mantenimiento',
    name_en: 'Maintenance',
    image_url: '/images/services/maintenance.jpg',
    disabled: true,
  },
  {
    slug: 'transportation',
    name_es: 'Transporte',
    name_en: 'Transportation',
    image_url: '/images/services/transportation.jpg',
    disabled: true,
  },
  {
    slug: 'gardening',
    name_es: 'Jardinería',
    name_en: 'Gardening',
    image_url: '/images/services/gardening.jpg',
    disabled: true,
  },
  {
    slug: 'air',
    name_es: 'Aires acondicionados',
    name_en: 'Air Conditioning',
    image_url: '/images/services/air.jpg',
    disabled: true,
  },
  {
    slug: 'architecture',
    name_es: 'Arquitectura',
    name_en: 'Architecture',
    image_url: '/images/services/architecture.jpg',
    disabled: true,
  },
  {
    slug: 'electrician',
    name_es: 'Electricista',
    name_en: 'Electrician',
    image_url: '/images/services/electrician.jpg',
    disabled: true,
  },
  {
    slug: 'locksmith',
    name_es: 'Cerrajería',
    name_en: 'Locksmith',
    image_url: '/images/services/locksmith.jpg',
    disabled: true,
  },
  {
    slug: 'moving',
    name_es: 'Mudanzas',
    name_en: 'Moving Services',
    image_url: '/images/services/moving.jpg',
    disabled: true,
  },
  {
    slug: 'painting',
    name_es: 'Pintura',
    name_en: 'Painting Services',
    image_url: '/images/services/painting.jpg',
    disabled: true,
  },
  {
    slug: 'phone',
    name_es: 'Telecomunicaciones',
    name_en: 'Telecommunications',
    image_url: '/images/services/phone.jpg',
    disabled: true,
  },
  {
    slug: 'plumbing',
    name_es: 'Plomería',
    name_en: 'Plumbing',
    image_url: '/images/services/plumbing.jpg',
    disabled: true,
  },
];
