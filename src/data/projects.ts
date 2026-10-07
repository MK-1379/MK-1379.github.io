import type { Project } from '@/types'

export const projects: Project[] = [
  {
    slug: 'medicita',
    title: 'MediCita',
    context: { es: 'Proyecto de clase', en: 'Class project' },
    summary: {
      es: 'Aplicación web de gestión de citas médicas con dos roles, médico y paciente. Los médicos publican huecos de citas y los pacientes los reservan',
      en: 'Web app for managing medical appointments with two roles, doctor and patient. Doctors publish available slots and patients book them',
    },
    highlights: [
      { es: 'Patrón MVC propio en PHP, sin framework', en: 'Custom MVC pattern in PHP, no framework' },
      {
        es: 'Contraseñas con bcrypt y migración automática desde MD5 en el siguiente inicio de sesión',
        en: 'Passwords hashed with bcrypt, with automatic migration from MD5 on the next login',
      },
      {
        es: 'Consultas con PDO y sentencias preparadas; sesión regenerada al iniciar sesión',
        en: 'PDO prepared statements; session ID regenerated on login',
      },
    ],
    stack: ['PHP', 'PDO', 'MariaDB / MySQL', 'HTML', 'CSS', 'JavaScript'],
    repo: 'https://github.com/MK-1379/medicita',
    image: {
      src: '/img/projects/medicita.webp',
      alt: {
        es: 'Panel del paciente en MediCita con el resumen de citas y el historial',
        en: 'MediCita patient dashboard with the appointment summary and history',
      },
      width: 1108,
      height: 410,
    },
  },
  {
    slug: 'kumafy',
    title: 'Kumafy',
    context: { es: 'Proyecto personal', en: 'Personal project' },
    summary: {
      es: 'Reproductor de música de escritorio con ventana propia y tres listas por género',
      en: 'Desktop music player with a custom window and three genre playlists',
    },
    highlights: [
      {
        es: 'Controles de reproducción, barra de progreso y avance automático',
        en: 'Playback controls, progress bar and auto-advance',
      },
      {
        es: 'Proceso principal y página separados, comunicados por un puente seguro (preload)',
        en: 'Main process and page kept separate, communicating through a secure bridge (preload)',
      },
      { es: 'Instalador para Windows publicado en Releases', en: 'Windows installer published in Releases' },
    ],
    stack: ['Electron', 'JavaScript', 'HTML', 'CSS', 'electron-builder'],
    repo: 'https://github.com/MK-1379/kumafy',
    download: 'https://github.com/MK-1379/kumafy/releases',
    image: {
      src: '/img/projects/kumafy.webp',
      alt: {
        es: 'Ventana de Kumafy reproduciendo una canción de la lista de piano',
        en: 'Kumafy window playing a track from the piano playlist',
      },
      width: 399,
      height: 716,
    },
  },
  {
    slug: 'hospital-jdbc',
    title: 'HospitalJDBC',
    context: { es: 'Proyecto de clase', en: 'Class project' },
    summary: {
      es: 'Aplicación Java que gestiona médicos y pacientes de un hospital sobre una base de datos MySQL, accedida con JDBC',
      en: "Java application that manages a hospital's doctors and patients on a MySQL database accessed through JDBC",
    },
    highlights: [
      { es: 'Separación en capas: DAO y repositorios', en: 'Layered design: DAOs and repositories' },
      {
        es: 'Excepción propia (DataAccessException) en lugar de propagar errores de SQL',
        en: 'Custom exception (DataAccessException) instead of leaking SQL errors',
      },
      {
        es: 'Configuración de la base de datos fuera del código, en un archivo de propiedades',
        en: 'Database configuration kept out of the code, in a properties file',
      },
    ],
    stack: ['Java 21', 'Maven', 'JDBC', 'MySQL'],
    repo: 'https://github.com/MK-1379/hospital-jdbc',
  },
]
