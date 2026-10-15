<script setup lang="ts">
import { profile } from '@/data/profile'
</script>

<template>
  <footer class="border-t border-muted/20">
    <div
      class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted"
    >
      <p>{{ profile.name }}</p>
    </div>
  </footer>
</template>