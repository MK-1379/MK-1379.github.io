<script setup lang="ts">
import { ref } from 'vue'
import { profile } from '@/data/profile'
import { useLocale } from '@/i18n/locale'
import { vMagnetic } from '@/directives/magnetic'
import { TimerIcon } from '@animateicons/vue/lucide'
import AnimatedIcon from '@/components/AnimatedIcon.vue'

const { t, tr } = useLocale()

const dialog = ref<HTMLDialogElement | null>(null)

function open() {
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close()
}

function onDialogClick(event: MouseEvent) {
  if (event.target === dialog.value) close()
}
</script>

<template>
  <button
    v-magnetic
    type="button"
    class="inline-flex items-center gap-2 rounded-md border border-muted/40 px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    aria-haspopup="dialog"
    @click="open"
  >
    <AnimatedIcon :icon="TimerIcon" class="text-accent" />
    {{ t.summary.open }}
  </button>

  <dialog
    ref="dialog"
    class="quick-summary m-auto w-[min(32rem,calc(100%-2rem))] rounded-lg border border-muted/25 bg-surface p-0 text-text shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    aria-labelledby="resumen-titulo"
    @click="onDialogClick"
  >
    <div class="p-6 md:p-8">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="font-mono text-xs text-accent">{{ t.summary.eyebrow }}</p>
          <h2 id="resumen-titulo" class="mt-1 font-display text-2xl font-bold tracking-tight">
            {{ t.summary.title }}
          </h2>
        </div>
        <button
          type="button"
          class="rounded-md p-2 text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-accent"
          :aria-label="t.summary.close"
          @click="close"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <p
        v-if="profile.availability"
        class="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400"
      >
        <span class="size-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
        {{ tr(profile.availability) }}
      </p>

      <ul class="mt-5 list-disc space-y-2 pl-5 text-muted marker:text-accent">
        <li v-for="item in profile.summary" :key="item.es">{{ tr(item) }}</li>
      </ul>

      <div class="mt-7 flex flex-wrap gap-3 text-sm font-semibold">
        <a
          href="#proyectos"
          class="rounded-md bg-accent px-4 py-2 text-bg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          @click="close"
        >
          {{ t.hero.projects }}
        </a>
        <a
          :href="t.cvFile"
          download
          class="rounded-md border border-muted/40 px-4 py-2 text-text transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {{ t.hero.cv }}<span class="sr-only">{{ t.hero.cvSr }}</span>
        </a>
      </div>
    </div>
  </dialog>
</template>
