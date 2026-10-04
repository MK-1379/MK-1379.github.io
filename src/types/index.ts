export interface Profile {
  name: string
  role: string
  location: string
  tagline: string
  email: string
  github: string
  linkedin: string
  about: string[]
}

export type SkillLevel = 'con-proyectos' | 'conocimientos-base' | 'siguiente-paso'

export interface Skill {
  name: string
  level: SkillLevel
}

export interface Project {
  slug: string
  title: string
  context: string
  summary: string
  highlights: string[]
  stack: string[]
  repo: string
  download?: string
  image?: ProjectImage
}

export interface ProjectImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface ChampionStat {
  name: string
  games: number
  winRate: number
}

export interface GamingProfile {
  game: string
  server: string
  role: string
  currentRank: string
  winRate: number
  games: number
  champions: ChampionStat[]
  profileUrl: string
  updatedAt: string
}