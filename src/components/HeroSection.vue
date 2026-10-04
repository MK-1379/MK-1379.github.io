<script setup lang="ts">
import { profile } from '@/data/profile'
</script>

<template>
  <section
    class="relative isolate flex min-h-[32rem] items-center overflow-hidden bg-bg md:min-h-[calc(100svh-4.25rem)]"
  >
    <div class="hero-bg animate-hero-bg absolute -inset-[4%] -z-20" aria-hidden="true"></div>
    <div
      class="absolute inset-0 -z-10 bg-gradient-to-r from-bg via-bg/70 to-transparent md:via-bg/40"
      aria-hidden="true"
    ></div>

    <div class="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
      <div class="md:max-w-xl">
        <p class="animate-rise font-mono text-sm text-accent">
          v2.0 · {{ profile.location }}
        </p>

        <h1
          class="animate-rise mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-text md:text-5xl"
          style="animation-delay: 80ms"
        >
          {{ profile.name }}
          <span class="block text-muted">{{ profile.role }}.</span>
        </h1>

        <p
          class="animate-rise mt-6 text-lg text-muted"
          style="animation-delay: 160ms"
        >
          {{ profile.tagline }}
        </p>

        <div
          class="animate-rise mt-10 flex flex-wrap gap-4"
          style="animation-delay: 240ms"
        >
          <a
            href="#proyectos"
            class="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-bg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Ver proyectos
          </a>
          <a
            :href="profile.github"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-md border border-muted/40 px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  </section>
</template>