<script setup lang="ts">
import { ref } from 'vue'
import { profile } from '@/data/profile'
import { useLocale } from '@/i18n/locale'
import HeroScene from '@/components/HeroScene.vue'

const { t, tr } = useLocale()

// Posición del brillo que sigue al ratón, en coordenadas de la sección
const spotX = ref('70%')
const spotY = ref('40%')
const spotActive = ref(false)

function moveSpot(event: PointerEvent) {
  // Solo con ratón: en pantallas táctiles no hay "hover"
  if (event.pointerType !== 'mouse') return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  spotX.value = `${event.clientX - rect.left}px`
  spotY.value = `${event.clientY - rect.top}px`
  spotActive.value = true
}

function hideSpot() {
  spotActive.value = false
}

// En escritorio la imagen de fondo está oculta (.scene-fallback) y la escena 3D aparece
// con un fundido al dibujar su primer fotograma. Si la escena falla, vuelve la imagen.
const sceneReady = ref(false)
const sceneFailed = ref(false)
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

        <h1
          class="animate-rise mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-text md:text-5xl"
          style="animation-delay: 80ms"
        >
          {{ profile.name }}
          <span class="block text-muted">{{ tr(profile.role) }}</span>
        </h1>

        <p
          class="animate-rise mt-6 text-lg text-muted"
          style="animation-delay: 160ms"
        >
          {{ tr(profile.tagline) }}
        </p>

        <div
          class="animate-rise mt-10 flex flex-wrap gap-4"
          style="animation-delay: 240ms"
        >
          <a
            href="#proyectos"
            class="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-bg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {{ t.hero.projects }}
          </a>
          <a
            :href="profile.github"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-md border border-muted/40 px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            GitHub
          </a>
          <a
            :href="t.cvFile"
            download
            class="rounded-md border border-muted/40 px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {{ t.hero.cv }}<span class="sr-only">{{ t.hero.cvSr }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>