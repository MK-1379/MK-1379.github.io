<script setup lang="ts">
import { projects } from '@/data/projects'
import { useLocale } from '@/i18n/locale'

const { t, tr } = useLocale()

function tiltShot(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const shot = event.currentTarget as HTMLElement
  const rect = shot.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height
  shot.classList.add('is-tilting')
  shot.style.setProperty('--tilt-x', `${(0.5 - y) * 10}deg`)
  shot.style.setProperty('--tilt-y', `${(x - 0.5) * 14}deg`)
  shot.style.setProperty('--glare-x', `${x * 100}%`)
  shot.style.setProperty('--glare-y', `${y * 100}%`)
  shot.style.setProperty('--glare', '1')
}

function resetShot(event: PointerEvent) {
  const shot = event.currentTarget as HTMLElement
  shot.classList.remove('is-tilting')
  shot.style.removeProperty('--tilt-x')
  shot.style.removeProperty('--tilt-y')
  shot.style.removeProperty('--glare')
}
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
        class="section-title font-display text-3xl font-bold tracking-tight text-text md:text-4xl"
      >
        {{ t.projects.title }}
      </h2>

      <div class="relative mt-14">
        <div
          class="graph-line absolute bottom-6 left-[0.4375rem] top-2 w-0.5 rounded-full"
          aria-hidden="true"
        ></div>

        <ol class="space-y-20 md:space-y-24">
          <li
            v-for="(project, index) in projects"
            :key="project.slug"
            class="project-entry relative pl-10 md:pl-14"
          >
            <span
              class="graph-node absolute left-0 top-1.5 size-4 rounded-full"
              :class="index % 2 === 0 ? 'text-accent' : 'graph-node-2 text-accent-2'"
              aria-hidden="true"
            ></span>

            <div
              class="grid gap-8"
              :class="project.image ? 'lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-12' : ''"
            >
              <div class="min-w-0">
                <p class="font-mono text-sm text-muted">{{ tr(project.context) }}</p>
                <h3 class="mt-2 font-display text-2xl font-bold tracking-tight text-text md:text-3xl">
                  {{ project.title }}
                </h3>
                <p class="mt-3 max-w-2xl text-lg text-muted">{{ tr(project.summary) }}</p>

                <ul class="mt-5 max-w-2xl list-disc space-y-2 pl-5 text-muted marker:text-accent-2">
                  <li v-for="item in project.highlights" :key="item.es">{{ tr(item) }}</li>
                </ul>

                <ul class="mt-6 flex flex-wrap gap-2" :aria-label="t.tech">
                  <li
                    v-for="tech in project.stack"
                    :key="tech"
                    class="rounded border border-muted/30 px-2 py-1 font-display text-xs text-muted"
                  >
                    {{ tech }}
                  </li>
                </ul>

                <div class="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
                  <a
                    v-if="project.demo"
                    :href="project.demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="rounded-md bg-accent px-4 py-2 text-bg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {{ t.projects.demo }}<span class="sr-only">{{ t.projects.demoSr(project.title) }}</span>
                  </a>
                  <a
                    :href="project.repo"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="rounded-md border border-muted/40 px-4 py-2 text-text transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {{ t.projects.code }}<span class="sr-only">{{ t.projects.codeSr(project.title) }}</span>
                  </a>
                  <a
                    v-if="project.download"
                    :href="project.download"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="rounded-md bg-accent px-4 py-2 text-bg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {{ t.projects.download }}<span class="sr-only">{{ t.projects.downloadSr(project.title) }}</span>
                  </a>
                </div>
              </div>

              <div
                v-if="project.image"
                class="project-shot self-start rounded-md lg:mt-8"
                :class="project.image.height > project.image.width ? 'w-full max-w-56 lg:mx-auto' : 'w-full'"
                @pointermove="tiltShot"
                @pointerleave="resetShot"
              >
                <img
                  :src="project.image.src"
                  :alt="tr(project.image.alt)"
                  :width="project.image.width"
                  :height="project.image.height"
                  loading="lazy"
                  decoding="async"
                  class="block h-auto w-full rounded-md border border-muted/20"
                />
              </div>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
