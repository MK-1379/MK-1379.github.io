<script setup lang="ts">
import { onMounted } from 'vue'
import { useLocale } from '@/i18n/locale'
import { useDeskSound } from '@/composables/useDeskSound'
import { Volume2Icon, VolumeXIcon } from '@animateicons/vue/lucide'
import AnimatedIcon from '@/components/AnimatedIcon.vue'

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
    <AnimatedIcon :icon="enabled ? Volume2Icon : VolumeXIcon" :size="20" />
  </button>
</template>
