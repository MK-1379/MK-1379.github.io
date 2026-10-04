export interface Profile {
  name: string
  role: string
  location: string
  tagline: string
  email: string
  github: string
  linkedin: string
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
}