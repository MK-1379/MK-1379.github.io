<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types'
import { useLocale, type Locale } from '@/i18n/locale'
import { useProjectStatus } from '@/composables/useProjectStatus'

const props = defineProps<{ project: Project }>()

const { t, locale } = useLocale()
const { pushedAt, reachability } = useProjectStatus(props.project.repo, props.project.demo)

const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['week', 604_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
]

function relativeTime(date: Date, language: Locale) {
  const seconds = (date.getTime() - Date.now()) / 1000
  const formatter = new Intl.RelativeTimeFormat(language, { numeric: 'auto' })
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit)
  }
  return formatter.format(0, 'minute')
}

const lastPush = computed(() =>
  pushedAt.value ? relativeTime(pushedAt.value, locale.value) : null,
)
</script>

<template>
  <ul
    v-if="project.demo || lastPush"
    class="mt-3 flex flex-wrap gap-2 font-mono text-xs"
    :aria-label="t.projects.status.label"
  >
    <li
      v-if="project.demo"
      class="inline-flex items-center gap-1.5 rounded px-2 py-1"
      :class="
        reachability === 'online'
          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
          : 'bg-muted/10 text-muted'
      "
    >
      <span
        class="size-1.5 rounded-full"
        :class="{
          'bg-emerald-500': reachability === 'online',
          'bg-muted motion-safe:animate-pulse': reachability === 'checking',
          'bg-muted/60': reachability === 'offline',
        }"
        aria-hidden="true"
      ></span>
      {{ t.projects.status[reachability]
      }}<template v-if="project.hosting"> · {{ project.hosting }}</template>
    </li>
    <li v-if="lastPush" class="rounded bg-muted/10 px-2 py-1 text-muted">
      {{ t.projects.status.lastPush }} {{ lastPush }}
    </li>
  </ul>
</template>
