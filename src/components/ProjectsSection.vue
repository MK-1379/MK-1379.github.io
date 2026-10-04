<script setup lang="ts">
import { projects } from '@/data/projects'
</script>

<template>
  <section
    id="proyectos"
    aria-labelledby="proyectos-titulo"
    class="scroll-mt-20 border-t border-muted/20 py-20 md:py-28"
  >
    <div class="mx-auto max-w-6xl px-6">
      <h2
        id="proyectos-titulo"
        class="mt-2 font-display text-3xl font-bold tracking-tight text-text md:text-4xl"
      >
        Proyectos
      </h2>

      <ul class="mt-12 divide-y divide-muted/20 border-y border-muted/20">
        <li
          v-for="project in projects"
          :key="project.slug"
          class="grid gap-4 py-10 md:grid-cols-[12rem_1fr] md:gap-12"
        >
          <p class="font-mono text-sm text-muted">{{ project.context }}</p>

          <div>
            <h3 class="font-display text-2xl font-bold tracking-tight text-text">
              {{ project.title }}
            </h3>
            <p class="mt-3 max-w-2xl text-lg text-muted">{{ project.summary }}</p>

            <ul class="mt-5 max-w-2xl list-disc space-y-2 pl-5 text-muted marker:text-accent">
              <li v-for="item in project.highlights" :key="item">{{ item }}</li>
            </ul>

            <ul class="mt-6 flex flex-wrap gap-2" aria-label="Tecnologías">
              <li
                v-for="tech in project.stack"
                :key="tech"
                class="rounded border border-muted/30 px-2 py-1 font-mono text-xs text-muted"
              >
                {{ tech }}
              </li>
            </ul>

            <div class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              <a
                :href="project.repo"
                target="_blank"
                rel="noopener noreferrer"
                class="text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Código<span class="sr-only"> de {{ project.title }} en GitHub</span>
              </a>
              <a
                v-if="project.download"
                :href="project.download"
                target="_blank"
                rel="noopener noreferrer"
                class="text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Descargar<span class="sr-only"> {{ project.title }} para Windows</span>
              </a>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>