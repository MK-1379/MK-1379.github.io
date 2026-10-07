<script setup lang="ts">
import { experience } from '@/data/experience'
</script>

<template>
  <section
    id="experiencia"
    aria-labelledby="experiencia-titulo"
    class="scroll-mt-20 border-t border-muted/20 py-20 md:py-28"
  >
    <div class="mx-auto max-w-6xl px-6">
      <h2
        id="experiencia-titulo"
        class="font-display text-3xl font-bold tracking-tight text-text md:text-4xl"
      >
        Experiencia
      </h2>

      <ol class="mt-12 space-y-16">
        <li
          v-for="job in experience"
          :key="job.company"
          class="grid gap-8"
          :class="job.image ? 'lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16' : ''"
        >
          <div class="min-w-0">
            <p class="font-mono text-sm text-muted">{{ job.period }}</p>
            <h3 class="mt-2 font-display text-2xl font-bold tracking-tight text-text md:text-3xl">
              {{ job.role }}
            </h3>
            <p class="mt-1 text-lg font-semibold">
              <a
                v-if="job.companyUrl"
                :href="job.companyUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-accent-2 underline decoration-accent-2/40 underline-offset-4 transition-colors hover:decoration-accent-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {{ job.company }}<span class="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
              <span v-else class="text-accent-2">{{ job.company }}</span>
            </p>

            <ul class="mt-5 max-w-2xl list-disc space-y-2 pl-5 text-lg text-muted marker:text-accent">
              <li v-for="item in job.highlights" :key="item">{{ item }}</li>
            </ul>

            <ul class="mt-6 flex flex-wrap gap-2" aria-label="Tecnologías">
              <li
                v-for="tech in job.stack"
                :key="tech"
                class="rounded border border-muted/30 px-2 py-1 font-display text-xs text-muted"
              >
                {{ tech }}
              </li>
            </ul>

            <p v-if="job.note" class="mt-5 max-w-2xl text-sm text-muted">{{ job.note }}</p>
          </div>

          <img
            v-if="job.image"
            :src="job.image.src"
            :alt="job.image.alt"
            :width="job.image.width"
            :height="job.image.height"
            loading="lazy"
            decoding="async"
            class="animate-float pointer-events-none mx-auto h-auto w-full max-w-56 self-center lg:max-w-none"
          />
        </li>
      </ol>
    </div>
  </section>
</template>
