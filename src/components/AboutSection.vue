<script setup lang="ts">
import { profile } from '@/data/profile'
import { useLocale } from '@/i18n/locale'
import WordReveal from '@/components/WordReveal.vue'
import { vPauseOffscreen } from '@/directives/pauseOffscreen'

const { t, tr } = useLocale()
</script>

<template>
  <section
    id="sobre-mi"
    aria-labelledby="sobre-mi-titulo"
    class="scroll-mt-20 border-t border-muted/20 py-20 md:py-28"
  >
    <div class="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[18rem_1fr] md:gap-16">
      <div v-pause-offscreen class="glow-border w-full max-w-xs self-start rounded-lg p-[3px] md:max-w-none">
        <img
          src="/img/mario-800.webp"
          srcset="/img/mario-400.webp 400w, /img/mario-800.webp 800w"
          sizes="(min-width: 768px) 18rem, 100vw"
          width="800"
          height="800"
          :alt="profile.name"
          loading="lazy"
          decoding="async"
          class="block aspect-square w-full rounded-md object-cover"
        />
      </div>

      <div>
        <h2
          id="sobre-mi-titulo"
          class="section-title mt-2 font-display text-3xl font-bold tracking-tight text-text md:text-4xl"
        >
          <WordReveal :text="t.about.title" />
        </h2>

        <div class="mt-6 max-w-2xl space-y-4 text-lg text-muted">
          <p v-for="paragraph in profile.about" :key="paragraph.es">{{ tr(paragraph) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>