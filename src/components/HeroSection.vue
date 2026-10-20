<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { profile } from '@/data/profile'
import { projects } from '@/data/projects'
import { experience } from '@/data/experience'
import { languages } from '@/data/languages'
import { useLocale } from '@/i18n/locale'
import HeroScene from '@/components/HeroScene.vue'
import { vMagnetic } from '@/directives/magnetic'

const { t, tr } = useLocale()

const spotX = ref('70%')
const spotY = ref('40%')
const spotActive = ref(false)

const parallaxX = ref(0)
const parallaxY = ref(0)

function moveSpot(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  spotX.value = `${event.clientX - rect.left}px`
  spotY.value = `${event.clientY - rect.top}px`
  spotActive.value = true
  parallaxX.value = (event.clientX - rect.left) / rect.width - 0.5
  parallaxY.value = (event.clientY - rect.top) / rect.height - 0.5
}

function hideSpot() {
  spotActive.value = false
  parallaxX.value = 0
  parallaxY.value = 0
}

const heroTech = [
  { name: 'Vue', icon: 'vuejs', x: '30%', y: '20%', depth: 1.2, delay: '0s' },
  { name: 'React', icon: 'react', x: '74%', y: '14%', depth: 0.8, delay: '-1.6s' },
  { name: 'TypeScript', icon: 'typescript', x: '82%', y: '68%', depth: 1, delay: '-3.1s' },
  { name: 'Node.js', icon: 'nodejs', x: '26%', y: '74%', depth: 1.4, delay: '-2.2s' },
  { name: 'Docker', icon: 'docker', x: '56%', y: '86%', depth: 0.6, delay: '-4s' },
  { name: 'PHP', icon: 'php', x: '88%', y: '40%', depth: 0.9, delay: '-2.7s' },
  { name: 'MySQL', icon: 'mysql', iconDark: 'mysql-dark', x: '14%', y: '46%', depth: 1.1, delay: '-0.8s' },
]

const projectCount = ref(projects.length)
const internship = experience[0]
const english = languages.find((language) => language.name.en === 'English')

function countProjects() {
  const target = projects.length
  const duration = 900
  let start = 0
  projectCount.value = 0
  function step(timestamp: number) {
    start ||= timestamp + 850
    const progress = Math.min(1, Math.max(0, (timestamp - start) / duration))
    projectCount.value = Math.round(target * (1 - (1 - progress) ** 3))
    if (progress < 1) countFrame = requestAnimationFrame(step)
  }
  countFrame = requestAnimationFrame(step)
}

let countFrame = 0

const sceneReady = ref(false)
const sceneFailed = ref(false)

let charIndex = 0
const nameWords = profile.name
  .split(' ')
  .map((word) => [...word].map((letter) => ({ letter, index: charIndex++ })))

const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}=_#'
const scrambledRole = ref<{ letter: string; scrambled: boolean }[] | null>(null)
const roleText = computed(() => tr(profile.role))
let frameId = 0

function scrambleRole() {
  let start = 0
  function frame(timestamp: number) {
    start ||= timestamp
    const target = roleText.value
    const revealed = Math.max(0, Math.floor((timestamp - start - 300) / 28))
    if (revealed >= target.length) {
      scrambledRole.value = null
      return
    }
    scrambledRole.value = [...target].map((letter, index) =>
      index < revealed || letter === ' '
        ? { letter, scrambled: false }
        : { letter: glyphs.charAt(Math.floor(Math.random() * glyphs.length)), scrambled: true },
    )
    frameId = requestAnimationFrame(frame)
  }
  frameId = requestAnimationFrame(frame)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  scrambleRole()
  countProjects()
})
onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  cancelAnimationFrame(countFrame)
})
</script>

<template>
  <section
    class="relative isolate flex min-h-[32rem] items-center overflow-hidden bg-bg md:min-h-[calc(100svh-4.25rem)]"
    @pointermove="moveSpot"
    @pointerleave="hideSpot"
  >
    <div
      class="scene-fallback hero-bg animate-hero-bg absolute -inset-[4%] -z-20"
      :class="{ 'scene-failed': sceneFailed }"
      aria-hidden="true"
    ></div>
    <HeroScene
      class="absolute top-0 right-0 -z-20 h-full w-1/2 transition-opacity duration-700"
      :class="sceneReady ? 'opacity-100' : 'opacity-0'"
      @ready="sceneReady = true"
      @failed="sceneFailed = true"
    />
    <div
      class="absolute inset-0 -z-10 bg-gradient-to-r from-bg via-bg/70 to-transparent md:via-bg/40"
      aria-hidden="true"
    ></div>
    <div
      class="pointer-events-none absolute top-0 right-0 -z-10 h-full w-1/2 max-xl:hidden"
      :style="{ '--hero-px': parallaxX, '--hero-py': parallaxY }"
      aria-hidden="true"
    >
      <span
        v-for="tech in heroTech"
        :key="tech.name"
        class="hero-tech absolute"
        :style="{ left: tech.x, top: tech.y, '--depth': tech.depth }"
      >
        <span
          class="hero-tech-chip inline-flex items-center gap-2 rounded-full border border-muted/25 bg-surface/50 px-3.5 py-1.5 font-display text-sm text-text shadow-lg backdrop-blur-md"
          :style="{ '--float-delay': tech.delay }"
        >
          <img
            :src="`/img/skills/${tech.icon}.svg`"
            alt=""
            width="18"
            height="18"
            class="size-[18px]"
            :class="{ 'dark:hidden': tech.iconDark }"
          />
          <img
            v-if="tech.iconDark"
            :src="`/img/skills/${tech.iconDark}.svg`"
            alt=""
            width="18"
            height="18"
            class="hidden size-[18px] dark:block"
          />
          {{ tech.name }}
        </span>
      </span>
    </div>
    <div
      class="hero-spotlight pointer-events-none absolute inset-0 -z-10"
      :class="{ 'is-active': spotActive }"
      :style="{ '--spot-x': spotX, '--spot-y': spotY }"
      aria-hidden="true"
    ></div>

    <div class="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
      <div class="md:max-w-xl">
        <p class="animate-rise font-mono text-sm text-accent">
          {{ tr(profile.status) }} · {{ profile.location }}
        </p>

        <h1 class="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-text md:text-5xl">
          <span class="sr-only">{{ profile.name }}</span>
          <span aria-hidden="true">
            <template v-for="(word, wordIndex) in nameWords" :key="wordIndex">
              <span class="inline-block whitespace-nowrap"><span
                  v-for="char in word"
                  :key="char.index"
                  class="hero-char"
                  :style="{ '--i': char.index }"
                >{{ char.letter }}</span></span>{{ wordIndex < nameWords.length - 1 ? ' ' : '' }}
            </template>
          </span>
          <span class="animate-rise block text-muted" style="animation-delay: 300ms">
            <span class="sr-only">{{ roleText }}</span>
            <span aria-hidden="true">
              <template v-if="scrambledRole">
                <span
                  v-for="(char, index) in scrambledRole"
                  :key="index"
                  :class="{ 'text-accent': char.scrambled }"
                >{{ char.letter }}</span>
              </template>
              <template v-else>{{ roleText }}</template>
            </span>
          </span>
        </h1>

        <p
          class="animate-rise mt-6 text-lg text-muted md:max-w-md"
          style="animation-delay: 650ms"
        >
          {{ tr(profile.tagline) }}
        </p>

        <ul
          class="animate-rise mt-6 flex flex-wrap gap-2 xl:hidden"
          style="animation-delay: 700ms"
          :aria-label="t.tech"
        >
          <li
            v-for="tech in heroTech"
            :key="tech.name"
            class="inline-flex items-center gap-1.5 rounded-full border border-muted/25 bg-surface/50 px-3 py-1 font-display text-xs text-text backdrop-blur-md"
          >
            <img
              :src="`/img/skills/${tech.icon}.svg`"
              alt=""
              width="14"
              height="14"
              class="size-3.5"
              :class="{ 'dark:hidden': tech.iconDark }"
            />
            <img
              v-if="tech.iconDark"
              :src="`/img/skills/${tech.iconDark}.svg`"
              alt=""
              width="14"
              height="14"
              class="hidden size-3.5 dark:block"
            />
            {{ tech.name }}
          </li>
        </ul>

        <div
          class="animate-rise mt-10 flex flex-wrap gap-4"
          style="animation-delay: 750ms"
        >
          <a
            v-magnetic
            href="#proyectos"
            class="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-bg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {{ t.hero.projects }}
          </a>
          <a
            v-magnetic
            :href="profile.github"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-md border border-muted/40 px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            GitHub
          </a>
          <a
            v-magnetic
            :href="t.cvFile"
            download
            class="rounded-md border border-muted/40 px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {{ t.hero.cv }}<span class="sr-only">{{ t.hero.cvSr }}</span>
          </a>
        </div>

        <dl
          class="animate-rise mt-10 flex flex-wrap gap-x-8 gap-y-4"
          style="animation-delay: 850ms"
          :aria-label="t.hero.highlights"
        >
          <div class="border-l-2 border-accent/60 pl-3">
            <dt class="sr-only">{{ t.hero.stats.projects }}</dt>
            <dd class="font-display text-2xl font-bold tabular-nums text-text">{{ projectCount }}</dd>
            <dd class="text-sm text-muted" aria-hidden="true">{{ t.hero.stats.projects }}</dd>
          </div>
          <div v-if="internship" class="border-l-2 border-accent-2/60 pl-3">
            <dt class="sr-only">{{ t.hero.stats.internship }}</dt>
            <dd class="font-display text-2xl font-bold text-text">{{ internship.company }}</dd>
            <dd class="text-sm text-muted" aria-hidden="true">{{ t.hero.stats.internship }}</dd>
          </div>
          <div v-if="english" class="border-l-2 border-accent-3/60 pl-3">
            <dt class="sr-only">{{ t.hero.stats.english }}</dt>
            <dd class="font-display text-2xl font-bold text-text">{{ tr(english.level) }}</dd>
            <dd class="text-sm text-muted" aria-hidden="true">{{ t.hero.stats.english }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>