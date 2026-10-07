import type { Experience } from '@/types'

export const experience: Experience[] = [
  {
    company: 'Globant GUT',
    companyUrl: 'https://www.globant.com/es/gut-network',
    role: { es: 'Desarrollador frontend en prácticas', en: 'Frontend Developer Intern' },
    period: 'Mar 2026 – May 2026',
    highlights: [
      {
        es: 'Maquetación y mantenimiento de interfaces web con Vue, Nuxt, TypeScript y Tailwind CSS.',
        en: 'Built and maintained web interfaces with Vue, Nuxt, TypeScript and Tailwind CSS.',
      },
      {
        es: 'Creación y reutilización de componentes, cuidando el detalle visual y la consistencia.',
        en: 'Created reusable components, with attention to visual detail and consistency.',
      },
      {
        es: 'Adaptación responsive de las interfaces a distintos tamaños de pantalla.',
        en: 'Made interfaces responsive across different screen sizes.',
      },
      {
        es: 'Trabajo en equipo con Git y metodologías de desarrollo profesionales.',
        en: 'Worked in a team using Git and professional development practices.',
      },
    ],
    stack: ['Vue', 'Nuxt', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Git'],
    note: {
      es: 'El código de las prácticas pertenece a la empresa, por eso no lo enseño aquí.',
      en: "The code from the internship belongs to the company, so I can't show it here.",
    },
    image: {
      src: '/img/experiencia-cristal.webp',
      alt: '',
      width: 560,
      height: 479,
    },
  },
]
