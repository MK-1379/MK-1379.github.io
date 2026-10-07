<script setup lang="ts">
import { skills } from '@/data/skills'
import type { SkillLevel } from '@/types'
import { useLocale } from '@/i18n/locale'

const { t, tr } = useLocale()

interface SkillGroup {
  level: SkillLevel
  // Clases de color de cada nivel: punto del título y borde de las etiquetas
  dotClass: string
  chipClass: string
}

const groups: SkillGroup[] = [
  {
    level: 'con-proyectos',
    dotClass: 'bg-accent',
    chipClass: 'border-accent/45 hover:bg-accent/10',
  },
  {
    level: 'conocimientos-base',
    dotClass: 'bg-accent-2',
    chipClass: 'border-accent-2/45 hover:bg-accent-2/10',
  },
  {
    level: 'siguiente-paso',
    dotClass: 'bg-accent-3',
    chipClass: 'border-accent-3/45 border-dashed hover:bg-accent-3/10',
  },
]

function skillsByLevel(level: SkillLevel) {
  return skills.filter((skill) => skill.level === level)
}
</script>

<template>
  <section
    id="skills"
    aria-labelledby="skills-titulo"
    class="scroll-mt-20 border-t border-muted/20 py-20 md:py-28"
  >
    <div class="mx-auto max-w-6xl px-6">
      <h2
        id="skills-titulo"
        class="font-display text-3xl font-bold tracking-tight text-text md:text-4xl"
      >
        {{ t.skills.title }}
      </h2>

      <div class="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
        <div v-for="group in groups" :key="group.level">
          <h3 class="flex items-center gap-3 font-display text-xl font-bold tracking-tight text-text">
            <span class="size-2.5 rounded-full" :class="group.dotClass" aria-hidden="true"></span>
            {{ t.skills.groups[group.level].title }}
          </h3>
          <p class="mt-2 text-muted">{{ t.skills.groups[group.level].description }}</p>

          <ul class="mt-5 flex flex-wrap gap-2">
            <li
              v-for="skill in skillsByLevel(group.level)"
              :key="tr(skill.name)"
              class="rounded border px-2 py-1 font-display text-xs text-text transition-colors"
              :class="group.chipClass"
            >
              {{ tr(skill.name) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
