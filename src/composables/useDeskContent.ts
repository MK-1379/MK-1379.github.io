import { projects } from '@/data/projects'
import { useLocale } from '@/i18n/locale'
import type { DeskItemId } from '@/scenes/deskItems'

const projectSlugs: Partial<Record<DeskItemId, string>> = {
  lolstats: 'lolstats',
  bracketly: 'bracketly',
  kumafy: 'kumafy',
}

const screenSlugs: Partial<Record<DeskItemId, string>> = {
  ...projectSlugs,
  clase: 'medicita',
}

function findProject(slug: string | undefined) {
  return slug ? projects.find((project) => project.slug === slug) : undefined
}

export function deskProject(id: DeskItemId | null) {
  return id ? findProject(projectSlugs[id]) : undefined
}

export function deskScreenshot(id: DeskItemId) {
  return findProject(screenSlugs[id])?.image?.src
}

export function useDeskLabels() {
  const { t } = useLocale()

  function labelFor(id: DeskItemId) {
    return deskProject(id)?.title ?? t.value.desk.labels[id as keyof typeof t.value.desk.labels]
  }

  return { labelFor }
}
