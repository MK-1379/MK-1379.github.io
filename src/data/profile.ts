import type { Profile } from '@/types'

export const profile: Profile = {
  name: 'Mario Díaz González',
  role: { es: 'Desarrollador Web Junior', en: 'Junior Web Developer' },
  location: 'Logroño, La Rioja',
  status: { es: 'Estudiante de 2º de DAW', en: '2nd-year Web Development student' },
  tagline: {
    es: 'Frontend con Vue y TypeScript. Convierto diseños en interfaces cuidadas, responsive y fáciles de mantener.',
    en: 'Frontend with Vue and TypeScript. I turn designs into polished, responsive and maintainable interfaces.',
  },
  email: 'mariodiaz2007@gmail.com',
  github: 'https://github.com/MK-1379',
  linkedin: 'https://www.linkedin.com/in/mario-díaz-gonzález-561a99234/',
  about: [
    {
      es: 'Estudio 2º de Desarrollo de Aplicaciones Web en Jesuitas Logroño. Lo que más me gusta es el frontend: convertir un diseño en una interfaz cuidada, consistente y que funcione bien en cualquier pantalla.',
      en: "I'm in my second year of Web Application Development at Jesuitas Logroño. What I enjoy most is frontend work: turning a design into a polished, consistent interface that works well on any screen.",
    },
    {
      es: 'Además del frontend, en clase he trabajado con Java, PHP y bases de datos, y sigo aprendiendo por mi cuenta. Este portfolio está hecho con Vue, TypeScript, Tailwind CSS y vite-ssg.',
      en: "Beyond the frontend, I've worked with Java, PHP and databases in class, and I keep learning on my own. This portfolio is built with Vue, TypeScript, Tailwind CSS and vite-ssg.",
    },
  ],
}
