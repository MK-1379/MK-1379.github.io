<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { IconComponent } from '@animateicons/vue'

const props = withDefaults(
  defineProps<{ icon: IconComponent; size?: number; active?: boolean }>(),
  { size: 16, active: false },
)

const root = ref<HTMLElement | null>(null)
const player = ref<InstanceType<IconComponent> | null>(null)
let trigger: HTMLElement | null = null

function play() {
  player.value?.startAnimation()
}

onMounted(() => {
  trigger = root.value?.closest<HTMLElement>('a, button') ?? null
  trigger?.addEventListener('mouseenter', play)
  trigger?.addEventListener('focusin', play)
})

onBeforeUnmount(() => {
  trigger?.removeEventListener('mouseenter', play)
  trigger?.removeEventListener('focusin', play)
})

watch(
  () => props.active,
  (active) => {
    if (active) play()
  },
)

watch(
  () => props.icon,
  () => {
    if (trigger?.matches(':hover, :focus-within')) requestAnimationFrame(play)
  },
  { flush: 'post' },
)

defineExpose({ play })
</script>

<template>
  <span ref="root" class="inline-flex shrink-0" aria-hidden="true">
    <component :is="icon" ref="player" :size="size" :is-animated="false" />
  </span>
</template>
