<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { languages } from '@/data/languages'
import { skills } from '@/data/skills'
import type { SkillLevel } from '@/types'
import { useLocale } from '@/i18n/locale'

const { t, tr } = useLocale()

interface SkillGroup {
  level: SkillLevel
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

const skillGrid = ref<HTMLElement | null>(null)
const chipsHidden = ref(false)
const chipsPlaying = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  const grid = skillGrid.value
  if (!grid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (grid.getBoundingClientRect().top < window.innerHeight) return
  chipsHidden.value = true
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      chipsHidden.value = false
      chipsPlaying.value = true
      observer?.disconnect()
    },
    { rootMargin: '0px 0px -15% 0px' },
  )
  observer.observe(grid)
})

onBeforeUnmount(() => observer?.disconnect())
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
        class="section-title font-display text-3xl font-bold tracking-tight text-text md:text-4xl"
      >
        {{ t.skills.title }}
      </h2>

      <div
        ref="skillGrid"
        class="mt-12 grid gap-12 md:grid-cols-3 md:gap-10"
        :class="{ 'chips-hidden': chipsHidden, 'chips-playing': chipsPlaying }"
      >
        <div v-for="group in groups" :key="group.level">
          <h3 class="flex items-center gap-3 font-display text-xl font-bold tracking-tight text-text">
            <span class="size-2.5 rounded-full" :class="group.dotClass" aria-hidden="true"></span>
            {{ t.skills.groups[group.level].title }}
          </h3>
          <p class="mt-2 text-muted">{{ t.skills.groups[group.level].description }}</p>

          <ul class="mt-5 flex flex-wrap gap-2">
            <li
              v-for="(skill, index) in skillsByLevel(group.level)"
              :key="tr(skill.name)"
              class="skill-chip inline-flex items-center gap-1.5 rounded border px-2 py-1 font-display text-xs text-text transition-colors"
              :class="group.chipClass"
              :style="{ '--i': index }"
            >
              <img
                v-if="skill.icon"
                :src="`/img/skills/${skill.icon}.svg`"
                alt=""
                width="16"
                height="16"
                loading="lazy"
                class="size-4"
                :class="{ 'dark:hidden': skill.iconDark }"
              />
              <img
                v-if="skill.iconDark"
                :src="`/img/skills/${skill.iconDark}.svg`"
                alt=""
                width="16"
                height="16"
                loading="lazy"
                class="hidden size-4 dark:block"
              />
              {{ tr(skill.name) }}
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-14 border-t border-muted/20 pt-10">
        <h3 class="font-display text-xl font-bold tracking-tight text-text">
          {{ t.skills.languages }}
        </h3>
        <ul class="mt-4 space-y-2 text-muted">
          <li v-for="language in languages" :key="language.name.es">
            <span class="font-semibold text-text">{{ tr(language.name) }}</span>
            · {{ tr(language.level) }}<template v-if="language.credentials">:
              {{ language.credentials.map((credential) => tr(credential)).join(' · ') }}</template>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
