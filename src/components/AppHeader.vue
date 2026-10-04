<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'

const links = [
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Skills', href: '#skills' },
  { label: 'Sobre mí', href: '#sobre-mi' },
  { label: 'Contacto', href: '#contacto' },
]
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-muted/20 bg-bg/80 backdrop-blur">
    <a
      href="#contenido"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-text"
    >
      Saltar al contenido
    </a>
    <nav aria-label="Principal" class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <a href="#" class="font-display text-lg font-semibold text-text">Mario Díaz</a>
      <div class="flex items-center gap-6">
        <ul class="hidden items-center gap-6 md:flex">
          <li v-for="link in links" :key="link.href">
            <a :href="link.href" class="text-sm text-muted transition-colors hover:text-text">
              {{ link.label }}
            </a>
          </li>
        </ul>
        <ThemeToggle />
      </div>
    </nav>
  </header>
</template>