<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{ text: string }>()

const root = ref<HTMLElement | null>(null)
const state = ref<'idle' | 'waiting' | 'playing'>('idle')
const words = computed(() => props.text.split(' '))
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!root.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  state.value = 'waiting'
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      state.value = 'playing'
      observer?.disconnect()
    },
    { threshold: 0.6 },
  )
  observer.observe(root.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <span ref="root" class="word-reveal" :class="`is-${state}`">
    <span class="sr-only">{{ text }}</span>
    <span aria-hidden="true">
      <span v-for="(word, index) in words" :key="`${index}-${word}`" class="word-slot">
        <span class="word" :style="{ '--w': index }">{{ word }}</span>
      </span>
    </span>
  </span>
</template>
