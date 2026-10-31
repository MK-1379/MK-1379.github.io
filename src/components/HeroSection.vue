<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { profile } from '@/data/profile'
import { experience } from '@/data/experience'
import { languages } from '@/data/languages'
import { useLocale } from '@/i18n/locale'
import DeskScene from '@/components/DeskScene.vue'
import DeskStatic from '@/components/DeskStatic.vue'
import QuickSummary from '@/components/QuickSummary.vue'
import { ArrowRightIcon, FileDownIcon, GithubIcon } from '@animateicons/vue/lucide'
import AnimatedIcon from '@/components/AnimatedIcon.vue'
import { vMagnetic } from '@/directives/magnetic'

const { t, tr } = useLocale()

const spotX = ref('70%')
const spotY = ref('40%')
const spotActive = ref(false)

function moveSpot(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  spotX.value = `${event.clientX - rect.left}px`
  spotY.value = `${event.clientY - rect.top}px`
  spotActive.value = true
}

function hideSpot() {
  spotActive.value = false
}

const testCount = ref(profile.automatedTests)
const internship = experience[0]
const english = languages.find((language) => language.name.en === 'English')

function countTests() {
  const target = profile.automatedTests
  const duration = 900
  let start = 0
  testCount.value = 0
  function step(timestamp: number) {
    start ||= timestamp + 850
    const progress = Math.min(1, Math.max(0, (timestamp - start) / duration))
    testCount.value = Math.round(target * (1 - (1 - progress) ** 3))
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
  countTests()
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
      class="scene-fallback hero-bg animate-hero-bg absolute -inset-[4%] -z-20 md:hidden"
      :class="{ 'scene-failed': sceneFailed }"
      aria-hidden="true"
    ></div>
    <div
      class="hero-light pointer-events-none absolute inset-0 -z-[5] transition-opacity duration-1000 max-md:hidden"
      :class="sceneReady || sceneFailed ? 'opacity-100' : 'opacity-0'"
      aria-hidden="true"
    ></div>
    <div
      class="hero-grid pointer-events-none absolute inset-0 -z-20 transition-opacity duration-1000 max-md:hidden"
      :class="sceneReady || sceneFailed ? 'opacity-100' : 'opacity-0'"
      aria-hidden="true"
    ></div>
    <div
      class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-bg via-bg/70 to-transparent md:via-bg/40"
      aria-hidden="true"
    ></div>
    <div
      class="hero-spotlight pointer-events-none absolute inset-0 -z-10"
      :class="{ 'is-active': spotActive }"
      :style="{ '--spot-x': spotX, '--spot-y': spotY }"
      aria-hidden="true"
    ></div>

    <div class="pointer-events-none relative z-10 mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
      <div class="pointer-events-auto md:max-w-xl">
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
            <span aria-hidden="true" class="relative block">
              <span :class="{ invisible: scrambledRole }">{{ roleText }}</span>
              <span v-if="scrambledRole" class="absolute inset-0">
                <span
                  v-for="(char, index) in scrambledRole"
                  :key="index"
                  :class="{ 'text-accent': char.scrambled }"
                >{{ char.letter }}</span>
              </span>
            </span>
          </span>
        </h1>

        <p
          v-if="profile.availability"
          class="animate-rise mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400"
          style="animation-delay: 500ms"
        >
          <span class="relative flex size-2" aria-hidden="true">
            <span class="absolute inline-flex size-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping"></span>
            <span class="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
          </span>
          {{ tr(profile.availability) }}
        </p>

        <p
          class="animate-rise mt-6 text-lg text-muted md:max-w-md"
          style="animation-delay: 650ms"
        >
          {{ tr(profile.tagline) }}
        </p>

        <div
          class="animate-rise mt-10 flex flex-wrap gap-4"
          style="animation-delay: 750ms"
        >
          <a
            v-magnetic
            href="#proyectos"
            class="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-bg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {{ t.hero.projects }}
            <AnimatedIcon :icon="ArrowRightIcon" />
          </a>
          <a
            v-magnetic
            :href="profile.github"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-md border border-muted/40 px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <AnimatedIcon :icon="GithubIcon" />
            GitHub
          </a>
          <a
            v-magnetic
            :href="t.cvFile"
            download
            class="inline-flex items-center gap-2 rounded-md border border-muted/40 px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <AnimatedIcon :icon="FileDownIcon" />
            {{ t.hero.cv }}<span class="sr-only">{{ t.hero.cvSr }}</span>
          </a>
          <QuickSummary />
        </div>

        <dl
          class="animate-rise mt-10 flex flex-wrap gap-x-8 gap-y-4"
          style="animation-delay: 850ms"
          :aria-label="t.hero.highlights"
        >
          <div class="border-l-2 border-accent/60 pl-3">
            <dt class="sr-only">{{ t.hero.stats.tests }}</dt>
            <dd class="font-display text-2xl font-bold tabular-nums text-text">+{{ testCount }}</dd>
            <dd class="text-sm text-muted" aria-hidden="true">{{ t.hero.stats.tests }}</dd>
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

        <DeskStatic compact class="mt-12 md:hidden" />
      </div>
    </div>

    <DeskScene
      class="absolute top-0 right-0 h-full w-1/2 transition-opacity duration-700"
      :class="sceneReady ? 'opacity-100' : 'opacity-0'"
      @ready="sceneReady = true"
      @failed="sceneFailed = true"
    />
    <div
      v-if="sceneFailed"
      class="absolute top-0 right-0 flex h-full w-1/2 items-center pr-6 max-md:hidden"
    >
      <DeskStatic class="relative w-full" />
    </div>
  </section>
</template>