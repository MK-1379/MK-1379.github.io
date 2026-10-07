import type { Experience } from '@/types'

export const experience: Experience[] = [
  {
    company: 'Globant GUT',
    companyUrl: 'https://www.globant.com/es/gut-network',
    role: 'Desarrollador frontend en prácticas',
    period: 'Mar 2026 – May 2026',
    highlights: [
      'Maquetación y mantenimiento de interfaces web con Vue, Nuxt, TypeScript y Tailwind CSS.',
      'Creación y reutilización de componentes, cuidando el detalle visual y la consistencia.',
      'Adaptación responsive de las interfaces a distintos tamaños de pantalla.',
      'Trabajo en equipo con Git y metodologías de desarrollo profesionales.',
    ],
    stack: ['Vue', 'Nuxt', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Git'],
    note: 'El código de las prácticas pertenece a la empresa, por eso no lo enseño aquí.',
    image: {
      src: '/img/experiencia-cristal.webp',
      alt: '',
      width: 560,
      height: 479,
    },
  },
]
