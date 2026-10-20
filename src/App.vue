<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useLocale } from '@/i18n/locale'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import CommandPalette from '@/components/CommandPalette.vue'

const { initLocale } = useLocale()
onMounted(initLocale)

const glow = ref<HTMLElement | null>(null)
let glowFrame = 0

function moveGlow(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  cancelAnimationFrame(glowFrame)
  glowFrame = requestAnimationFrame(() => {
    glow.value?.style.setProperty('--glow-x', `${event.clientX}px`)
    glow.value?.style.setProperty('--glow-y', `${event.clientY}px`)
    glow.value?.classList.add('is-active')
  })
}

function hideGlow() {
  glow.value?.classList.remove('is-active')
}

onMounted(() => {
  window.addEventListener('pointermove', moveGlow, { passive: true })
  document.documentElement.addEventListener('pointerleave', hideGlow)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(glowFrame)
  window.removeEventListener('pointermove', moveGlow)
  document.documentElement.removeEventListener('pointerleave', hideGlow)
})
</script>

<template>
  <div class="relative isolate">
    <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <span class="ambient-blob ambient-1"></span>
      <span class="ambient-blob ambient-2"></span>
      <span class="ambient-blob ambient-3"></span>
      <span class="ambient-blob ambient-4"></span>
      <div class="ambient-grain"></div>
    </div>
    <div ref="glow" class="cursor-glow pointer-events-none fixed inset-0 -z-10" aria-hidden="true"></div>

    <AppHeader />
    <main id="contenido">
      <RouterView />
    </main>
    <AppFooter />
    <CommandPalette />
  </div>
</template>