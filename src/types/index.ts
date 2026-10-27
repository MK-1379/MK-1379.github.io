import type { Localized } from '@/i18n/locale'

export interface Profile {
  name: string
  role: Localized
  location: string
  status: Localized
  availability?: Localized
  tagline: Localized
  summary: Localized[]
  email: string
  github: string
  linkedin: string
  about: Localized[]
}

export type SkillLevel = 'con-proyectos' | 'conocimientos-base' | 'siguiente-paso'

export interface Skill {
  name: Localized | string
  level: SkillLevel
  icon?: string
  iconDark?: string
}

export interface ProjectImage {
  src: string
  alt: Localized | string
  width: number
  height: number
}

export interface Project {
  slug: string
  title: string
  context: Localized
  summary: Localized
  highlights: Localized[]
  stack: string[]
  repo: string
  demo?: string
  hosting?: string
  download?: string
  image?: ProjectImage
}

export interface Language {
  name: Localized
  level: Localized
  credentials?: Localized[]
}

export interface Experience {
  company: string
  companyUrl?: string
  role: Localized
  period: string
  highlights: Localized[]
  stack: string[]
  note?: Localized
  image?: ProjectImage
}
