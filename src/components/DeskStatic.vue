<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useLocale } from '@/i18n/locale'
import { useDeskControls } from '@/composables/useDeskControls'
import { useDeskLabels } from '@/composables/useDeskContent'
import { deskItemIds, type DeskItemId } from '@/scenes/deskItems'
import DeskPanel from '@/components/DeskPanel.vue'
import DeskSoundToggle from '@/components/DeskSoundToggle.vue'

const props = withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })

const spots: Record<DeskItemId, { x: number; y: number }> = {
  lolstats: { x: 65.1, y: 22.6 },
  bracketly: { x: 71.4, y: 33.3 },
  kumafy: { x: 47.0, y: 26.7 },
  clase: { x: 49.7, y: 11.2 },
  cv: { x: 66.1, y: 43.4 },
  about: { x: 21.9, y: 20.4 },
  contact: { x: 55.4, y: 67.8 },
}

const { t } = useLocale()
const { labelFor } = useDeskLabels()

const labels = ref<Partial<Record<DeskItemId, HTMLElement>>>({})
const active = ref<DeskItemId | null>(null)

const { open, close, openFromHash } = useDeskControls({
  active,
  labels,
  enabled: () =>
    window.matchMedia(props.compact ? '(max-width: 767.98px)' : '(min-width: 768px)').matches,
})

onMounted(openFromHash)

function setLabel(id: DeskItemId, element: unknown) {
  if (element instanceof HTMLElement) labels.value[id] = element
}

function spotStyle(id: DeskItemId, index: number) {
  return { left: `${spots[id].x}%`, top: `${spots[id].y}%`, '--i': index }
}
</script>

<template>
  <div>
    <div class="relative">
      <img
        src="/img/escritorio-claro.webp"
        alt=""
        width="900"
        height="730"
        loading="lazy"
        decoding="async"
        class="block h-auto w-full dark:hidden"
      />
      <img
        src="/img/escritorio-oscuro.webp"
        alt=""
        width="900"
        height="730"
        loading="lazy"
        decoding="async"
        class="hidden h-auto w-full dark:block"
      />

      <template v-if="compact">
        <span
          v-for="(id, index) in deskItemIds"
          :key="id"
          class="desk-dot absolute"
          :class="{ 'is-active': id === active }"
          :style="spotStyle(id, index)"
          aria-hidden="true"
          @click="open(id)"
        ></span>
      </template>
      <template v-else>
        <button
          v-for="(id, index) in deskItemIds"
          :key="id"
          :ref="(element) => setLabel(id, element)"
          type="button"
          class="desk-label absolute rounded-full border border-accent/30 bg-surface/85 px-3 py-1.5 font-display text-sm font-semibold whitespace-nowrap text-text shadow-lg backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          :class="{ 'is-active': id === active }"
          :style="spotStyle(id, index)"
          :aria-expanded="id === active"
          aria-controls="escritorio-panel"
          @click="open(id)"
        >
          {{ labelFor(id) }}
        </button>
      </template>
    </div>

    <template v-if="compact">
      <p class="mt-2 text-center text-sm text-muted">{{ t.desk.mobileHint }}</p>
      <div class="mt-4 grid grid-cols-2 gap-2">
        <button
          v-for="id in deskItemIds"
          :key="id"
          :ref="(element) => setLabel(id, element)"
          type="button"
          class="min-h-11 rounded-md border border-muted/30 bg-surface/70 px-3 py-2 text-left text-sm font-semibold text-text transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          :class="id === active ? 'border-accent text-accent' : ''"
          :aria-expanded="id === active"
          aria-controls="escritorio-panel"
          @click="open(id)"
        >
          {{ labelFor(id) }}
        </button>
        <DeskSoundToggle class="justify-self-start" />
      </div>
    </template>
    <DeskSoundToggle v-else class="absolute bottom-6 left-6" />

    <Transition name="desk-panel">
      <DeskPanel v-if="active" :active="active" @close="close" />
    </Transition>
  </div>
</template>
