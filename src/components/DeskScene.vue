<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDeskScene } from '@/composables/useDeskScene'
import { useDeskControls } from '@/composables/useDeskControls'
import { deskScreenshot, useDeskLabels } from '@/composables/useDeskContent'
import { deskItemIds, type DeskItemId } from '@/scenes/deskItems'
import DeskPanel from '@/components/DeskPanel.vue'
import DeskSoundToggle from '@/components/DeskSoundToggle.vue'

const emit = defineEmits<{ ready: []; failed: [] }>()

const { labelFor } = useDeskLabels()

const canvas = ref<HTMLCanvasElement | null>(null)
const labels = ref<Partial<Record<DeskItemId, HTMLElement>>>({})
const ready = ref(false)

const { hovered, active, introDone } = useDeskScene({
  canvas,
  labels,
  screenshot: deskScreenshot,
  onReady: () => {
    ready.value = true
    emit('ready')
  },
  onFail: () => emit('failed'),
})

const { open, close, openFromHash } = useDeskControls({
  active,
  labels,
  enabled: () => ready.value,
})

watch(introDone, (done) => {
  if (done) openFromHash()
})

function setLabel(id: DeskItemId, element: unknown) {
  if (element instanceof HTMLElement) labels.value[id] = element
}

defineExpose({ open })
</script>

<template>
  <div class="max-md:hidden">
    <canvas ref="canvas" class="absolute inset-0 block size-full" aria-hidden="true"></canvas>

    <div v-show="ready && introDone" class="pointer-events-none absolute inset-0">
      <button
        v-for="(id, index) in deskItemIds"
        :key="id"
        :ref="(element) => setLabel(id, element)"
        type="button"
        class="desk-label pointer-events-auto absolute top-0 left-0 rounded-full border border-accent/30 bg-surface/85 px-3 py-1.5 font-display text-sm font-semibold whitespace-nowrap text-text shadow-lg backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        :class="{
          'is-active': id === hovered || id === active,
          'is-hidden': active && id !== active,
        }"
        :style="{ '--i': index }"
        :aria-expanded="id === active"
        aria-controls="escritorio-panel"
        @click="open(id)"
        @focus="hovered = id"
        @blur="hovered = null"
        @mouseenter="hovered = id"
        @mouseleave="hovered = null"
      >
        {{ labelFor(id) }}
      </button>
    </div>

    <DeskSoundToggle v-show="ready && introDone" class="absolute bottom-6 left-6" />

    <Transition name="desk-panel">
      <DeskPanel v-if="active" :active="active" @close="close" />
    </Transition>
  </div>
</template>
