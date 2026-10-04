<script setup lang="ts">
import { skills } from '@/data/skills'
import type { SkillLevel } from '@/types'

const groups: { level: SkillLevel; title: string; description: string }[] = [
  {
    level: 'con-proyectos',
    title: 'Con proyectos',
    description: 'Lo he usado en proyectos de clase o personales',
  },
  {
    level: 'conocimientos-base',
    title: 'Conocimientos base',
    description: 'Lo he trabajado en clase o en pruebas, sin un proyecto propio',
  },
  {
    level: 'siguiente-paso',
    title: 'Siguiente paso',
    description: 'Lo próximo voy a aprender',
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
        class="mt-2 font-display text-3xl font-bold tracking-tight text-text md:text-4xl"
      >
        Skills
      </h2>

      <div class="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
        <div v-for="group in groups" :key="group.level">
          <h3 class="font-display text-xl font-bold tracking-tight text-text">
            {{ group.title }}
          </h3>
          <p class="mt-2 text-muted">{{ group.description }}</p>

          <ul class="mt-5 flex flex-wrap gap-2">
            <li
              v-for="skill in skillsByLevel(group.level)"
              :key="skill.name"
              class="rounded border border-muted/30 px-2 py-1 font-mono text-xs text-muted"
            >
              {{ skill.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>