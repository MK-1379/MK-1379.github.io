<script setup lang="ts">
import { ref } from 'vue'
import { profile } from '@/data/profile'

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
    class="scroll-mt-20 border-t border-muted/20 py-20 md:py-28"
  >
    <div class="mx-auto max-w-6xl px-6">
      <h2
        id="contacto-titulo"
        class="mt-2 font-display text-3xl font-bold tracking-tight text-text md:text-4xl"
      >
        Contacto
      </h2>
      <p class="mt-4 max-w-2xl text-lg text-muted">
        Si quieres comentar algo sobre mis proyectos o proponerme algo puedes escribirme
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
          {{ copied ? 'Copiado' : 'Copiar' }}
        </button>
        <p role="status" class="sr-only">{{ copied ? 'Email copiado al portapapeles' : '' }}</p>
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
      </ul>
    </div>
  </section>
</template>