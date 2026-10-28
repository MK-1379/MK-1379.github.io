<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { profile } from '@/data/profile'
import { projects } from '@/data/projects'
import { useLocale } from '@/i18n/locale'
import { useTheme } from '@/composables/useTheme'
import { useCommandPalette } from '@/composables/useCommandPalette'
import type { IconComponent } from '@animateicons/vue'
import {
  BriefcaseIcon,
  CopyIcon,
  ExternalLinkIcon,
  FileDownIcon,
  FolderOpenIcon,
  GithubIcon,
  LanguagesIcon,
  LinkedinIcon,
  MailIcon,
  SunMoonIcon,
  UserIcon,
  WrenchIcon,
} from '@animateicons/vue/lucide'
import AnimatedIcon from '@/components/AnimatedIcon.vue'

type Group = 'navigate' | 'actions' | 'links'

interface Command {
  id: string
  label: string
  group: Group
  icon: IconComponent
  keepOpen?: boolean
  run: () => void | Promise<void>
}

const { t, toggleLocale } = useLocale()
const { toggle: toggleTheme } = useTheme()
const { isOpen, close, toggle } = useCommandPalette()

const dialog = ref<HTMLDialogElement | null>(null)
const input = ref<HTMLInputElement | null>(null)
const query = ref('')
const activeIndex = ref(0)
const feedback = ref('')

const lolstatsDemo = projects.find((project) => project.slug === 'lolstats')?.demo

function goTo(hash: string) {
  document.querySelector(hash)?.scrollIntoView()
}

function openLink(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

function downloadCv() {
  const link = document.createElement('a')
  link.href = t.value.cvFile
  link.download = ''
  link.click()
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    feedback.value = t.value.palette.copied
    setTimeout(close, 900)
  } catch {
    feedback.value = profile.email
  }
}

const commands = computed<Command[]>(() => {
  const links = t.value.nav.links
  const list: Command[] = [
    { id: 'experience', label: links.experience, group: 'navigate', icon: BriefcaseIcon, run: () => goTo('#experiencia') },
    { id: 'projects', label: links.projects, group: 'navigate', icon: FolderOpenIcon, run: () => goTo('#proyectos') },
    { id: 'skills', label: links.skills, group: 'navigate', icon: WrenchIcon, run: () => goTo('#skills') },
    { id: 'about', label: links.about, group: 'navigate', icon: UserIcon, run: () => goTo('#sobre-mi') },
    { id: 'contact', label: links.contact, group: 'navigate', icon: MailIcon, run: () => goTo('#contacto') },
    { id: 'theme', label: t.value.palette.theme, group: 'actions', icon: SunMoonIcon, run: () => toggleTheme() },
    { id: 'language', label: t.value.palette.language, group: 'actions', icon: LanguagesIcon, run: toggleLocale },
    { id: 'email', label: t.value.palette.copyEmail, group: 'actions', icon: CopyIcon, keepOpen: true, run: copyEmail },
    { id: 'cv', label: t.value.palette.downloadCv, group: 'actions', icon: FileDownIcon, run: downloadCv },
    { id: 'github', label: 'GitHub', group: 'links', icon: GithubIcon, run: () => openLink(profile.github) },
    { id: 'linkedin', label: 'LinkedIn', group: 'links', icon: LinkedinIcon, run: () => openLink(profile.linkedin) },
  ]
  if (lolstatsDemo) {
    list.push({ id: 'lolstats', label: 'LoLStats', group: 'links', icon: ExternalLinkIcon, run: () => openLink(lolstatsDemo) })
  }
  return list
})

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

const results = computed(() => {
  const search = normalize(query.value.trim())
  if (!search) return commands.value
  return commands.value.filter((command) =>
    normalize(`${command.label} ${t.value.palette.groups[command.group]}`).includes(search),
  )
})

const groups = computed(() =>
  (['navigate', 'actions', 'links'] as Group[])
    .map((group) => ({
      group,
      title: t.value.palette.groups[group],
      items: results.value.filter((command) => command.group === group),
    }))
    .filter((section) => section.items.length > 0),
)

const activeCommand = computed(() => results.value[activeIndex.value])

watch(query, () => {
  activeIndex.value = 0
  feedback.value = ''
})

watch(isOpen, async (open) => {
  const element = dialog.value
  if (!element) return
  if (open && !element.open) {
    query.value = ''
    feedback.value = ''
    activeIndex.value = 0
    element.showModal()
    await nextTick()
    input.value?.focus()
  } else if (!open && element.open) {
    element.close()
  }
})

async function runCommand(command: Command | undefined) {
  if (!command) return
  if (command.keepOpen) {
    await command.run()
    return
  }
  close()
  await nextTick()
  await command.run()
}

function moveActive(step: number) {
  const total = results.value.length
  if (total === 0) return
  activeIndex.value = (activeIndex.value + step + total) % total
  document.getElementById(`comando-${activeCommand.value?.id}`)?.scrollIntoView({ block: 'nearest' })
}

function onInputKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActive(1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(-1)
  } else if (event.key === 'Enter') {
    event.preventDefault()
    runCommand(activeCommand.value)
  }
}

function onDialogClick(event: MouseEvent) {
  if (event.target === dialog.value) close()
}

function onGlobalKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    toggle()
  }
}

onMounted(() => window.addEventListener('keydown', onGlobalKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKeydown))
</script>

<template>
  <dialog
    ref="dialog"
    class="command-palette m-auto mt-[12vh] w-[min(34rem,calc(100%-2rem))] overflow-hidden rounded-lg border border-muted/25 bg-surface p-0 text-text shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    :aria-label="t.palette.title"
    @close="close"
    @click="onDialogClick"
  >
    <div class="flex items-center gap-3 border-b border-muted/20 px-4">
      <svg
        width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" class="shrink-0 text-muted" aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        ref="input"
        v-model="query"
        type="text"
        role="combobox"
        aria-expanded="true"
        aria-controls="comandos"
        aria-autocomplete="list"
        :aria-activedescendant="activeCommand ? `comando-${activeCommand.id}` : undefined"
        :aria-label="t.palette.placeholder"
        aria-describedby="comandos-ayuda"
        :placeholder="t.palette.placeholder"
        autocomplete="off"
        spellcheck="false"
        class="w-full bg-transparent py-4 text-base text-text outline-none placeholder:text-muted"
        @keydown="onInputKeydown"
      />
      <kbd class="hidden shrink-0 rounded border border-muted/30 px-1.5 py-0.5 font-mono text-xs text-muted sm:block">Esc</kbd>
    </div>

    <p id="comandos-ayuda" class="sr-only">{{ t.palette.instructions }}</p>

    <ul id="comandos" role="listbox" :aria-label="t.palette.title" class="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
      <li v-for="section in groups" :key="section.group" role="presentation">
        <p class="px-3 pb-1 pt-3 font-mono text-xs uppercase tracking-wider text-muted" aria-hidden="true">
          {{ section.title }}
        </p>
        <ul role="group" :aria-label="section.title">
          <li
            v-for="command in section.items"
            :id="`comando-${command.id}`"
            :key="command.id"
            role="option"
            :aria-selected="command.id === activeCommand?.id"
            class="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm"
            :class="command.id === activeCommand?.id ? 'bg-accent/15 text-text' : 'text-muted'"
            @mousemove="activeIndex = results.indexOf(command)"
            @click="runCommand(command)"
          >
            <span class="flex items-center gap-3">
              <AnimatedIcon :icon="command.icon" :active="command.id === activeCommand?.id" />
              {{ command.label }}
            </span>
            <span
              v-if="command.id === 'email' && feedback"
              class="font-mono text-xs text-accent"
            >{{ feedback }}</span>
          </li>
        </ul>
      </li>
      <li v-if="groups.length === 0" role="presentation" class="px-3 py-6 text-center text-sm text-muted">
        {{ t.palette.empty }}
      </li>
    </ul>
    <p role="status" class="sr-only">{{ feedback }}</p>
  </dialog>
</template>
