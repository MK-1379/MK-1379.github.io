<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { profile } from '@/data/profile'
import { projects } from '@/data/projects'
import { useLocale } from '@/i18n/locale'
import { deskProject, useDeskLabels } from '@/composables/useDeskContent'
import { launchPaperPlane } from '@/effects/paperPlane'
import type { DeskItemId } from '@/scenes/deskItems'

const props = defineProps<{ active: DeskItemId }>()
const emit = defineEmits<{ close: [] }>()

const { t, tr } = useLocale()
const { labelFor } = useDeskLabels()

const heading = ref<HTMLElement | null>(null)
const copied = ref(false)

const activeProject = computed(() => deskProject(props.active))

const classProjects = projects.filter((project) => project.context.en === 'Class project')

async function focusHeading() {
  await nextTick()
  heading.value?.focus({ preventScroll: true })
}

onMounted(focusHeading)
watch(
  () => props.active,
  () => {
    copied.value = false
    void focusHeading()
  },
)

async function copyEmail(event: MouseEvent) {
  const button = event.currentTarget as HTMLElement
  try {
    await navigator.clipboard.writeText(profile.email)
    copied.value = true
    launchPaperPlane(button)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <aside
    id="escritorio-panel"
    class="z-50 grid gap-3 overflow-y-auto rounded-xl border border-muted/20 bg-surface p-6 text-text shadow-2xl max-md:fixed max-md:inset-x-3 max-md:bottom-3 max-md:max-h-[70svh] md:absolute md:top-6 md:right-6 md:z-10 md:max-h-[calc(100%-3rem)] md:w-[min(22rem,calc(100%-3rem))]"
    :aria-labelledby="`escritorio-${active}`"
  >
    <button
      type="button"
      class="absolute top-3 right-3 rounded-md p-2 text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-accent"
      :aria-label="t.desk.close"
      @click="emit('close')"
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
            {{ project.title }}<span class="sr-only">{{ t.projects.codeSr(project.title) }}</span>
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
      <a href="#sobre-mi" class="w-fit text-sm font-semibold text-accent" @click="emit('close')">
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
</template>
