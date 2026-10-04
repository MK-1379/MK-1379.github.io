<script setup lang="ts">
import { skills } from '@/data/skills'
import type { SkillLevel } from '@/types'

interface SkillGroup {
  level: SkillLevel
  title: string
  description: string
  // Clases de color de cada nivel: punto del título y borde de las etiquetas
  dotClass: string
  chipClass: string
}

const groups: SkillGroup[] = [
  {
    level: 'con-proyectos',
    title: 'Con proyectos',
    description: 'Lo he usado en proyectos de clase o personales',
    dotClass: 'bg-accent',
    chipClass: 'border-accent/45 hover:bg-accent/10',
  },
  {
    level: 'conocimientos-base',
    title: 'Conocimientos base',
    description: 'Lo he trabajado en clase o en pruebas, sin un proyecto propio',
    dotClass: 'bg-accent-2',
    chipClass: 'border-accent-2/45 hover:bg-accent-2/10',
  },
  {
    level: 'siguiente-paso',
    title: 'Siguiente paso',
    description: 'Lo próximo voy a aprender',
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
        Skills
      </h2>

      <div class="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
        <div v-for="group in groups" :key="group.level">
          <h3 class="flex items-center gap-3 font-display text-xl font-bold tracking-tight text-text">
            <span class="size-2.5 rounded-full" :class="group.dotClass" aria-hidden="true"></span>
            {{ group.title }}
          </h3>
          <p class="mt-2 text-muted">{{ group.description }}</p>

          <ul class="mt-5 flex flex-wrap gap-2">
            <li
              v-for="skill in skillsByLevel(group.level)"
              :key="skill.name"
              class="rounded border px-2 py-1 font-mono text-xs text-text transition-colors"
              :class="group.chipClass"
            >
              {{ skill.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
