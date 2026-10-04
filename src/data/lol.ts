import type { GamingProfile } from '@/types'

export const lol: GamingProfile = {
  game: 'League of Legends',
  server: 'EUW',
  role: 'support',
  currentRank: 'Diamante 4',
  winRate: 52,
  games: 722,
  champions: [
    { name: 'Nami', games: 451, winRate: 55 },
    { name: 'Lulu', games: 136, winRate: 49 },
    { name: 'Soraka', games: 42, winRate: 60 },
    { name: 'Janna', games: 38, winRate: 37 },
    { name: 'Syndra', games: 33, winRate: 64 },
  ],
  profileUrl: 'https://op.gg/es/lol/summoners/euw/M0n0kuum44-SSJ',
  updatedAt: 'octubre de 2026',
}