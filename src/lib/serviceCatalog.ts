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
    slug: 'air',
    name_es: 'Aires acondicionados',
    name_en: 'Air Conditioning',
    image_url: '/images/services/air.jpg',
    disabled: true,
  },
  {
    slug: 'brick',
    name_es: 'Albañilería',
    name_en: 'Masonry',
    image_url: '/images/services/brick.jpg',
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
