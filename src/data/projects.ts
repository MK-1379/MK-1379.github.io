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
]
