<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { profile } from '@/data/profile'
import { projects } from '@/data/projects'
import { useLocale } from '@/i18n/locale'
import { useDeskScene } from '@/composables/useDeskScene'
import { deskItemIds, type DeskItemId } from '@/scenes/desk'

const emit = defineEmits<{ ready: []; failed: [] }>()

const { t, tr } = useLocale()

const canvas = ref<HTMLCanvasElement | null>(null)
const labels = ref<Partial<Record<DeskItemId, HTMLElement>>>({})
const heading = ref<HTMLElement | null>(null)
const ready = ref(false)
const copied = ref(false)

const { hovered, active } = useDeskScene({
  canvas,
  labels,
  onReady: () => {
    ready.value = true
    emit('ready')
  },
  onFail: () => emit('failed'),
})

const projectItems: Partial<Record<DeskItemId, string>> = {
  lolstats: 'lolstats',
  bracketly: 'bracketly',
  kumafy: 'kumafy',
}

const classProjects = projects.filter((project) => project.context.en === 'Class project')

function labelFor(id: DeskItemId) {
  const slug = projectItems[id]
  if (slug) return projects.find((project) => project.slug === slug)?.title ?? id
  return t.value.desk.labels[id as keyof typeof t.value.desk.labels]
}

const activeProject = computed(() => {
  const slug = active.value ? projectItems[active.value] : undefined
  return slug ? projects.find((project) => project.slug === slug) : undefined
})

function setLabel(id: DeskItemId, element: unknown) {
  if (element instanceof HTMLElement) labels.value[id] = element
}

function open(id: DeskItemId) {
  active.value = id
}

function close() {
  const last = active.value
  active.value = null
  if (last) labels.value[last]?.focus({ preventScroll: true })
}

watch(active, async (id) => {
  copied.value = false
  if (!id) return
  await nextTick()
  heading.value?.focus({ preventScroll: true })
})

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    copied.value = true
  } catch {
    copied.value = false
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && active.value) close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

defineExpose({ open })
</script>

<template>
  <div class="max-md:hidden">
    <canvas ref="canvas" class="absolute inset-0 block size-full" aria-hidden="true"></canvas>

    <div v-show="ready" class="pointer-events-none absolute inset-0">
      <button
        v-for="id in deskItemIds"
        :key="id"
        :ref="(element) => setLabel(id, element)"
        type="button"
        class="desk-label pointer-events-auto absolute top-0 left-0 rounded-full border border-accent/30 bg-surface/85 px-3 py-1.5 font-display text-sm font-semibold whitespace-nowrap text-text shadow-lg backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        :class="{ 'is-active': id === hovered || id === active }"
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

    <Transition name="desk-panel">
      <aside
        v-if="active"
        id="escritorio-panel"
        class="absolute top-6 right-6 z-10 grid max-h-[calc(100%-3rem)] w-[min(22rem,calc(100%-3rem))] gap-3 overflow-y-auto rounded-xl border border-muted/20 bg-surface p-6 text-text shadow-2xl"
        :aria-labelledby="`escritorio-${active}`"
      >
        <button
          type="button"
          class="absolute top-3 right-3 rounded-md p-2 text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-accent"
          :aria-label="t.desk.close"
          @click="close"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <p class="font-mono text-xs text-accent">{{ t.desk.objects[active] }}</p>
        <h2
          :id="`escritorio-${active}`"
          ref="heading"
          tabindex="-1"
          class="pr-8 font-display text-2xl font-bold tracking-tight outline-none"
        >
          {{ labelFor(active) }}
        </h2>

        <template v-if="activeProject">
          <p class="text-sm text-muted">{{ tr(activeProject.summary) }}</p>
          <ul class="list-disc space-y-1 pl-5 text-sm text-muted marker:text-accent">
            <li v-for="item in activeProject.highlights.slice(0, 2)" :key="item.es">
              {{ tr(item) }}
            </li>
          </ul>
          <ul class="flex flex-wrap gap-1.5" :aria-label="t.tech">
            <li
              v-for="tech in activeProject.stack.slice(0, 5)"
              :key="tech"
              class="rounded border border-muted/30 px-2 py-0.5 text-xs text-muted"
            >
              {{ tech }}
            </li>
          </ul>
          <div class="mt-1 flex flex-wrap gap-2 text-sm font-semibold">
            <a
              v-if="activeProject.demo"
              :href="activeProject.demo"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-md bg-accent px-4 py-2 text-bg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {{ t.projects.demo
              }}<span class="sr-only">{{ t.projects.demoSr(activeProject.title) }}</span>
            </a>
            <a
              :href="activeProject.repo"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-md border border-muted/40 px-4 py-2 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {{ t.projects.code
              }}<span class="sr-only">{{ t.projects.codeSr(activeProject.title) }}</span>
            </a>
          </div>
        </template>

        <template v-else-if="active === 'clase'">
          <p class="text-sm text-muted">{{ t.desk.classText }}</p>
          <ul class="grid gap-3">
            <li v-for="project in classProjects" :key="project.slug" class="text-sm">
              <a
                :href="project.repo"
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold text-text underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
              >
                {{ project.title
                }}<span class="sr-only">{{ t.projects.codeSr(project.title) }}</span>
              </a>
              <p class="mt-0.5 text-muted">{{ tr(project.summary) }}</p>
            </li>
          </ul>
        </template>

        <template v-else-if="active === 'cv'">
          <p class="text-sm text-muted">{{ t.desk.cvText }}</p>
          <a
            :href="t.cvFile"
            download
            class="w-fit rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {{ t.hero.cv }}<span class="sr-only">{{ t.hero.cvSr }}</span>
          </a>
        </template>

        <template v-else-if="active === 'about'">
          <p class="text-sm text-muted">{{ tr(profile.about[0]!) }}</p>
          <a href="#sobre-mi" class="w-fit text-sm font-semibold text-accent" @click="close">
            {{ t.desk.more }}
          </a>
        </template>

        <template v-else-if="active === 'contact'">
          <p class="text-sm text-muted">{{ t.contact.text }}</p>
          <p class="font-mono text-sm select-all">{{ profile.email }}</p>
          <div class="flex flex-wrap gap-2 text-sm font-semibold">
            <button
              type="button"
              class="rounded-md bg-accent px-4 py-2 text-bg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              @click="copyEmail"
            >
              {{ copied ? t.contact.copied : t.contact.copy }}
            </button>
            <a
              :href="profile.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-md border border-muted/40 px-4 py-2 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              LinkedIn<span class="sr-only">{{ t.experience.newTab }}</span>
            </a>
          </div>
          <p role="status" class="sr-only">{{ copied ? t.contact.copiedStatus : '' }}</p>
        </template>
      </aside>
    </Transition>
  </div>
</template>
