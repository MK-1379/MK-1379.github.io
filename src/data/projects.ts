import type { Project } from '@/types'

export const projects: Project[] = [
    {
    slug: 'bracketly',
    title: 'Bracketly',
    context: { es: 'Proyecto personal', en: 'Personal project' },
    summary: {
      es: 'Gestor de torneos de esports para cualquier juego: cualquiera crea un torneo, los equipos se inscriben con un código de invitación y el cuadro se actualiza solo con cada resultado confirmado',
      en: 'Esports tournament manager for any game: anyone can create a tournament, teams sign up with an invite code and the bracket updates itself with every confirmed result',
    },
    highlights: [
      {
        es: 'Cuadro de eliminación directa con pases directos generado con TDD y dibujado en SVG, con su versión por rondas en móvil',
        en: 'Single-elimination bracket with byes, built with TDD and drawn in SVG, with a round-by-round view on mobile',
      },
      {
        es: 'API REST con Express, Zod y Prisma sobre MySQL; autenticación propia con bcrypt y JWT en cookie httpOnly; roles por torneo',
        en: 'REST API with Express, Zod and Prisma on MySQL; custom auth with bcrypt and a JWT in an httpOnly cookie; roles per tournament',
      },
      {
        es: '69 tests con Vitest y Supertest, 11 E2E con Playwright y despliegue automático en Oracle Cloud cuando pasa la CI',
        en: '69 tests with Vitest and Supertest, 11 Playwright E2E tests and automatic deploys to Oracle Cloud once CI passes',
      },
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'TanStack Query', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Docker'],
    repo: 'https://github.com/MK-1379/bracketly',
    demo: 'https://bracketly-mk.duckdns.org',
    hosting: 'Oracle Cloud',
    image: {
      src: '/img/projects/bracketly.webp',
      alt: {
        es: 'Cuadro de eliminación directa de Bracketly con los resultados de cada ronda y el equipo campeón',
        en: 'Bracketly single-elimination bracket with the results of each round and the champion team',
      },
      width: 1186,
      height: 650,
    },
  },
  {
    slug: 'lolstats',
    title: 'LoLStats',
    context: { es: 'Proyecto personal', en: 'Personal project' },
    summary: {
      es: 'Aplicación web full stack con mis estadísticas de League of Legends: clasificatoria, campeones más jugados e historial con el marcador de cada partida y una puntuación propia de 0 a 10',
      en: 'Full stack web app with my League of Legends stats: ranked status, most played champions and match history with a per-match scoreboard and a custom 0 to 10 score',
    },
    highlights: [
      {
        es: 'Worker con node-cron que sincroniza las partidas con la API de Riot cada 30 minutos, respetando sus límites de peticiones',
        en: 'node-cron worker that syncs matches from the Riot API every 30 minutes while respecting its rate limits',
      },
      {
        es: 'API REST con Express, validación con Zod y Prisma sobre MySQL; tests con Vitest y Supertest',
        en: 'REST API with Express, Zod validation and Prisma on MySQL; tested with Vitest and Supertest',
      },
      {
        es: 'Cuatro servicios en Docker Compose (MySQL, API, worker y nginx) y CI con GitHub Actions',
        en: 'Four services in Docker Compose (MySQL, API, worker and nginx) and CI with GitHub Actions',
      },
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'TanStack Query', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Docker'],
    repo: 'https://github.com/MK-1379/lol-stats',
    demo: 'https://lolstats-mk.duckdns.org',
    hosting: 'Oracle Cloud',
    image: {
      src: '/img/projects/lolstats.webp',
      alt: {
        es: 'Resumen de LoLStats con la clasificatoria, los campeones más jugados y el historial de partidas',
        en: 'LoLStats overview with ranked status, most played champions and match history',
      },
      width: 1186,
      height: 650,
    },
  },
  {
    slug: 'kumafy',
    title: 'Kumafy',
    context: { es: 'Proyecto personal', en: 'Personal project' },
    summary: {
      es: 'Reproductor de música de escritorio con visualizador de audio en tiempo real, listas por género y la opción de abrir tus propios archivos. También funciona en el navegador',
      en: 'Desktop music player with a live audio visualizer, genre playlists and the option to open your own files. It also runs in the browser',
    },
    highlights: [
      {
        es: 'Archivos locales servidos por un protocolo propio que solo entrega lo que eligió el usuario, con peticiones Range para poder saltar en la canción',
        en: 'Local files served through a custom protocol that only returns what the user picked, with range requests so seeking works',
      },
      {
        es: 'Visualizador con la Web Audio API y canvas, teclas multimedia con la Media Session API, shuffle, repeat y atajos de teclado',
        en: 'Visualizer built with the Web Audio API and canvas, media keys through the Media Session API, shuffle, repeat and keyboard shortcuts',
      },
      {
        es: '59 tests con Vitest y GitHub Actions que pasa la CI, publica la demo web y genera el instalador de Windows al crear una versión',
        en: '59 Vitest tests and GitHub Actions that run CI, publish the web demo and build the Windows installer for every release',
      },
    ],
    stack: ['Electron', 'JavaScript', 'HTML', 'CSS', 'Vitest', 'GitHub Actions', 'electron-builder'],
    repo: 'https://github.com/MK-1379/kumafy',
    demo: 'https://mk-1379.github.io/kumafy/',
    hosting: 'GitHub Pages',
    download: 'https://github.com/MK-1379/kumafy/releases/latest',
    image: {
      src: '/img/projects/kumafy.webp',
      alt: {
        es: 'Ventana de Kumafy reproduciendo una canción de Pop & Indie con el visualizador de audio sobre la portada',
        en: 'Kumafy window playing a Pop & Indie track with the audio visualizer over the cover',
      },
      width: 400,
      height: 720,
    },
  },
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
    image: {
      src: '/img/projects/hospital-jdbc.webp',
      alt: {
        es: 'Terminal con la salida de HospitalJDBC: altas, consultas, cambios y bajas de médicos y pacientes',
        en: 'Terminal showing HospitalJDBC output: creating, reading, updating and deleting doctors and patients',
      },
      width: 960,
      height: 599,
    },
  },
]
