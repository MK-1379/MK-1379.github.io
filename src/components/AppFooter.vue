<script setup lang="ts">
import { profile } from '@/data/profile'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-muted/20">
    <div
      class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted"
    >
      <p>© {{ year }} {{ profile.name }}</p>
      <p class="font-mono text-xs">Hecho con Vue, TypeScript y Tailwind CSS</p>
    </div>
  </footer>
</template>