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