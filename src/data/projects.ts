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
      es: 'Aplicación web con mis estadísticas de League of Legends: rango en SoloQ y Flex con mi peak, maestrías, historial con el marcador de cada partida, una puntuación propia de 0 a 10 y un coach que me da consejos con IA',
      en: 'Web app with my League of Legends stats: SoloQ and Flex rank with my peak, champion mastery, match history with a per-match scoreboard, a custom 0 to 10 score and an AI coach that gives me tips',
    },
    highlights: [
      {
        es: 'Frontend en React y TypeScript con TanStack Query: un filtro SoloQ/Flex global con Context vuelve a pedir los datos de todas las pestañas, y las animaciones respetan "reducir movimiento"',
        en: 'React and TypeScript frontend with TanStack Query: a global SoloQ/Flex filter built with Context refetches every tab, and animations respect "reduce motion"',
      },
      {
        es: 'Worker con node-cron que sincroniza partidas, rangos y maestrías con la API de Riot cada 30 minutos',
        en: 'node-cron worker that syncs matches, ranks and champion mastery from the Riot API every 30 minutes',
      },
      {
        es: 'API REST con Express, Zod y Prisma sobre MySQL; 124 tests con Vitest, Testing Library y Supertest; Docker Compose y despliegue automático con GitHub Actions',
        en: 'REST API with Express, Zod and Prisma on MySQL; 124 tests with Vitest, Testing Library and Supertest; Docker Compose and automatic deployment with GitHub Actions',
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
]
