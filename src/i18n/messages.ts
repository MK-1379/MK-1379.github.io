// Textos de la interfaz (botones, títulos, etiquetas). El contenido (proyectos, experiencia...) está en src/data.
const es = {
  meta: {
    title: 'Mario Díaz González · Desarrollador web',
    description:
      'Portfolio de Mario Díaz González, estudiante de 2º de Desarrollo de Aplicaciones Web en Logroño. Proyectos en Java, PHP, Vue y Electron.',
  },
  nav: {
    label: 'Principal',
    skip: 'Saltar al contenido',
    logoAlt: 'Mario Díaz González, ir al inicio',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    links: {
      experience: 'Experiencia',
      projects: 'Proyectos',
      skills: 'Skills',
      about: 'Sobre mí',
      contact: 'Contacto',
    },
  },
  theme: { toLight: 'Cambiar a tema claro', toDark: 'Cambiar a tema oscuro' },
  language: { switchTo: 'EN', switchLabel: 'Read in English', switchLang: 'en' },
  hero: { projects: 'Ver proyectos', cv: 'Descargar CV', cvSr: ' en PDF' },
  cvFile: '/CV-Mario-Diaz-Gonzalez.pdf',
  experience: { title: 'Experiencia', newTab: ' (se abre en una pestaña nueva)' },
  tech: 'Tecnologías',
  projects: {
    title: 'Proyectos',
    code: 'Ver código',
    codeSr: (title: string) => ` de ${title} en GitHub`,
    download: 'Descargar',
    downloadSr: (title: string) => ` ${title} para Windows`,
  },
  skills: {
    title: 'Skills',
    groups: {
      'con-proyectos': {
        title: 'Con proyectos',
        description: 'Lo he usado en proyectos de clase, personales o en prácticas',
      },
      'conocimientos-base': {
        title: 'Conocimientos base',
        description: 'Lo he trabajado en clase o en pruebas, sin un proyecto propio',
      },
      'siguiente-paso': {
        title: 'Siguiente paso',
        description: 'Lo próximo que voy a aprender',
      },
    },
  },
  about: { title: 'Sobre mí' },
  contact: {
    title: 'Contacto',
    text: 'Si quieres comentar algo sobre mis proyectos o proponerme algo, puedes escribirme',
    copy: 'Copiar',
    copied: 'Copiado',
    copiedStatus: 'Email copiado al portapapeles',
    cv: 'Descargar CV (PDF)',
  },
  footer: { builtWith: 'Hecho con Vue, TypeScript y Tailwind CSS' },
}

// typeof es: TypeScript avisa si falta algún texto en inglés
const en: typeof es = {
  meta: {
    title: 'Mario Díaz González · Web Developer',
    description:
      'Portfolio of Mario Díaz González, a second-year Web Application Development student in Logroño, Spain. Projects in Java, PHP, Vue and Electron.',
  },
  nav: {
    label: 'Main',
    skip: 'Skip to content',
    logoAlt: 'Mario Díaz González, back to top',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    links: {
      experience: 'Experience',
      projects: 'Projects',
      skills: 'Skills',
      about: 'About me',
      contact: 'Contact',
    },
  },
  theme: { toLight: 'Switch to light theme', toDark: 'Switch to dark theme' },
  language: { switchTo: 'ES', switchLabel: 'Ver en español', switchLang: 'es' },
  hero: { projects: 'View projects', cv: 'Download CV', cvSr: ' as PDF' },
  cvFile: '/CV-Mario-Diaz-Gonzalez-EN.pdf',
  experience: { title: 'Experience', newTab: ' (opens in a new tab)' },
  tech: 'Technologies',
  projects: {
    title: 'Projects',
    code: 'View code',
    codeSr: (title: string) => ` for ${title} on GitHub`,
    download: 'Download',
    downloadSr: (title: string) => ` ${title} for Windows`,
  },
  skills: {
    title: 'Skills',
    groups: {
      'con-proyectos': {
        title: 'Used in projects',
        description: 'I have used it in class, personal or internship projects',
      },
      'conocimientos-base': {
        title: 'Fundamentals',
        description: 'I have worked with it in class or in exercises, without a project of my own',
      },
      'siguiente-paso': {
        title: 'Next up',
        description: 'What I am going to learn next',
      },
    },
  },
  about: { title: 'About me' },
  contact: {
    title: 'Contact',
    text: 'If you would like to talk about my projects or have something in mind, feel free to write to me',
    copy: 'Copy',
    copied: 'Copied',
    copiedStatus: 'Email copied to clipboard',
    cv: 'Download CV (PDF)',
  },
  footer: { builtWith: 'Built with Vue, TypeScript and Tailwind CSS' },
}

export const messages = { es, en }
