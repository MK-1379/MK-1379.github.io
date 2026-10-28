<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useLocale } from '@/i18n/locale'
import { MoonIcon, SunIcon } from '@animateicons/vue/lucide'
import AnimatedIcon from '@/components/AnimatedIcon.vue'

const { theme, init, toggle } = useTheme()
const { t } = useLocale()
onMounted(init)

function toggleFromButton(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
}
</script>

<template>
  <button
    type="button"
    class="rounded-md p-2 text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    :aria-label="theme === 'dark' ? t.theme.toLight : t.theme.toDark"
    @click="toggleFromButton"
  >
    <AnimatedIcon :icon="theme === 'dark' ? SunIcon : MoonIcon" :size="20" />
  </button>
</template>