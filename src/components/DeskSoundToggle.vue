<script setup lang="ts">
import { onMounted } from 'vue'
import { useLocale } from '@/i18n/locale'
import { useDeskSound } from '@/composables/useDeskSound'

const { t } = useLocale()
const { enabled, init, toggle } = useDeskSound()

onMounted(init)
</script>

<template>
  <button
    type="button"
    class="inline-flex size-11 items-center justify-center rounded-full border border-accent/30 bg-surface/85 text-text shadow-lg backdrop-blur-md transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    :aria-pressed="enabled"
    :aria-label="t.desk.sound"
    :title="t.desk.sound"
    @click="toggle"
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <template v-if="enabled">
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path d="M18.5 5.5a9 9 0 0 1 0 13" />
      </template>
      <path v-else d="m22 9-6 6m0-6 6 6" />
    </svg>
  </button>
</template>
