<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div class="relative isolate">
    <!-- Fondo decorativo: manchas de color y grano, detrás de todo el contenido -->
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <span class="ambient-blob ambient-1"></span>
      <span class="ambient-blob ambient-2"></span>
      <span class="ambient-blob ambient-3"></span>
      <span class="ambient-blob ambient-4"></span>
      <div class="ambient-grain"></div>
    </div>

    <AppHeader />
    <main id="contenido">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>