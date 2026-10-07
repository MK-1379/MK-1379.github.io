<script setup lang="ts">
import { useLocale } from '@/i18n/locale'

const { t, toggleLocale } = useLocale()
</script>

<template>
  <!-- Muestra el idioma al que se cambia. lang hace que el lector de pantalla lo pronuncie bien -->
  <button
    type="button"
    class="rounded-md px-2 py-1.5 font-display text-sm font-semibold text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    :aria-label="t.language.switchLabel"
    :lang="t.language.switchLang"
    @click="toggleLocale"
  >
    {{ t.language.switchTo }}
  </button>
</template>
