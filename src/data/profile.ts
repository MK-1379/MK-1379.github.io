import type { Profile } from '@/types'

export const profile: Profile = {
  name: 'Mario Díaz González',
  role: { es: 'Desarrollador Web Junior', en: 'Junior Web Developer' },
  location: 'Logroño, La Rioja',
  status: { es: 'Estudiante de 2º de DAW', en: '2nd-year Web Development student' },
  tagline: {
    es: 'Frontend con React, Vue y TypeScript. Backend con Node.js, Express y MySQL.',
    en: 'Frontend with React, Vue and TypeScript. Backend with Node.js, Express and MySQL.',
  },
  summary: [
    {
      es: 'Estudiante de 2º de DAW en Logroño, con prácticas de frontend en Globant GUT con Vue, TypeScript y Tailwind CSS.',
      en: '2nd-year Web Development student in Logroño, with a frontend internship at Globant GUT using Vue, TypeScript and Tailwind CSS.',
    },
    {
      es: 'Hago aplicaciones completas con React y TypeScript en el frontend y Node.js, Express, Prisma y MySQL en el backend.',
      en: 'I build full stack apps with React and TypeScript on the frontend and Node.js, Express, Prisma and MySQL on the backend.',
    },
    {
      es: 'Dos aplicaciones en producción con tests, CI y despliegue automático: Bracketly y LoLStats.',
      en: 'Two apps in production with tests, CI and automatic deploys: Bracketly and LoLStats.',
    },
    {
      es: 'Inglés B2 certificado (Cambridge B2 First).',
      en: 'Certified B2 English (Cambridge B2 First).',
    },
  ],
  email: 'mariodiaz2007@gmail.com',
  github: 'https://github.com/MK-1379',
  linkedin: 'https://www.linkedin.com/in/mario-díaz-gonzález-561a99234/',
  about: [
    {
      es: 'Estudio 2º de Desarrollo de Aplicaciones Web en Jesuitas Logroño. Lo que más me gusta es el frontend: convertir un diseño en una interfaz cuidada, consistente y que funcione bien en cualquier pantalla.',
      en: "I'm in my second year of Web Application Development at Jesuitas Logroño. What I enjoy most is frontend work: turning a design into a polished, consistent interface that works well on any screen.",
    },
    {
      es: 'Además del frontend, en clase he trabajado con Java, PHP y bases de datos, y sigo aprendiendo por mi cuenta. Este portfolio está hecho con Vue, TypeScript y Tailwind CSS.',
      en: "Beyond the frontend, I've worked with Java, PHP and databases in class, and I keep learning on my own. This portfolio is built with Vue, TypeScript and Tailwind CSS.",
    },
  ],
}
