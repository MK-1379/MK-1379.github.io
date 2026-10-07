<script setup lang="ts">
import { profile } from '@/data/profile'
</script>

<template>
  <section
    id="sobre-mi"
    aria-labelledby="sobre-mi-titulo"
    class="scroll-mt-20 border-t border-muted/20 py-20 md:py-28"
  >
    <div class="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[18rem_1fr] md:gap-16">
      <img
        src="/img/mario-800.webp"
        srcset="/img/mario-400.webp 400w, /img/mario-800.webp 800w"
        sizes="(min-width: 768px) 18rem, 100vw"
        width="800"
        height="800"
        :alt="profile.name"
        loading="lazy"
        decoding="async"
        class="aspect-square w-full max-w-xs rounded-md object-cover md:max-w-none"
      />

      <div>
        <h2
          id="sobre-mi-titulo"
          class="mt-2 font-display text-3xl font-bold tracking-tight text-text md:text-4xl"
        >
          Sobre mí
        </h2>

        <div class="mt-6 max-w-2xl space-y-4 text-lg text-muted">
          <p v-for="paragraph in profile.about" :key="paragraph">{{ paragraph }}</p>
        </div>
      </div>
    </div>
  </section>
</template>