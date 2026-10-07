<script setup lang="ts">
import { ref } from 'vue'
import { profile } from '@/data/profile'
import { useLocale } from '@/i18n/locale'

const { t } = useLocale()

const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    copied.value = true
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => (copied.value = false), 2000)
  } catch {
    // Si el navegador no deja copiar, el email sigue visible para seleccionarlo a mano
  }
}
</script>

<template>
  <section
    id="contacto"
    aria-labelledby="contacto-titulo"
    class="relative isolate scroll-mt-20 overflow-hidden border-t border-muted/20 py-20 md:py-28"
  >
    <div class="relative mx-auto max-w-6xl px-6">
      <!-- Figura de cristal decorativa: cierra la página con el mismo material del hero -->
      <img
        src="/img/contacto-cristal.webp"
        alt=""
        width="600"
        height="479"
        loading="lazy"
        decoding="async"
        class="animate-float pointer-events-none absolute -right-20 -top-6 -z-10 w-60 opacity-35 md:right-0 md:top-1/2 md:w-[22rem] md:-translate-y-1/2 md:opacity-100"
      />

      <h2
        id="contacto-titulo"
        class="mt-2 font-display text-3xl font-bold tracking-tight text-text md:text-4xl"
      >
        {{ t.contact.title }}
      </h2>
      <p class="mt-4 max-w-2xl text-lg text-muted">
        {{ t.contact.text }}
      </p>

      <div class="mt-10 flex flex-wrap items-center gap-4">
        <a
          :href="`mailto:${profile.email}`"
          class="break-all font-display text-2xl font-bold tracking-tight text-text underline decoration-accent decoration-2 underline-offset-8 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:text-3xl"
        >
          {{ profile.email }}
        </a>
        <button
          type="button"
          class="rounded-md border border-muted/40 px-3 py-2 text-sm font-semibold text-text transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          @click="copyEmail"
        >
          {{ copied ? t.contact.copied : t.contact.copy }}
        </button>
        <p role="status" class="sr-only">{{ copied ? t.contact.copiedStatus : '' }}</p>
      </div>

      <ul class="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold">
        <li>
          <a
            :href="profile.github"
            target="_blank"
            rel="noopener noreferrer"
            class="text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            GitHub
          </a>
        </li>
        <li>
          <a
            :href="profile.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a
            :href="t.cvFile"
            download
            class="text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {{ t.contact.cv }}
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>