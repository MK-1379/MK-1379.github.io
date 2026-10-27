import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue'
import { deskItemIds, type DeskItemId } from '@/scenes/deskItems'
import { useDeskSound } from '@/composables/useDeskSound'

interface DeskControlsOptions {
  active: Ref<DeskItemId | null>
  labels: Ref<Partial<Record<DeskItemId, HTMLElement>>>
  enabled: () => boolean
}

function idFromHash() {
  const id = decodeURIComponent(window.location.hash.slice(1))
  return deskItemIds.find((itemId) => itemId === id) ?? null
}

function writeHash(id: DeskItemId | null) {
  const hash = id ? `#${id}` : ''
  if (window.location.hash === hash) return
  const { pathname, search } = window.location
  history.replaceState(history.state, '', `${pathname}${search}${hash}`)
}

export function useDeskControls({ active, labels, enabled }: DeskControlsOptions) {
  const sound = useDeskSound()

  function open(id: DeskItemId) {
    active.value = id
  }

  function close() {
    const last = active.value
    active.value = null
    if (last) labels.value[last]?.focus({ preventScroll: true })
  }

  function openFromHash() {
    if (!enabled()) return
    const id = idFromHash()
    if (id && id !== active.value) open(id)
  }

  const stopActiveWatch = watch(active, (id, previous) => {
    if (!enabled()) return
    writeHash(id)
    if (id) sound.click()
    if (id === 'kumafy') sound.startMusic()
    else if (previous === 'kumafy') sound.stopMusic()
  })

  const stopSoundWatch = watch(sound.enabled, (on) => {
    if (on && active.value === 'kumafy' && enabled()) sound.startMusic()
  })

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && active.value) close()
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('hashchange', openFromHash)
  })

  onBeforeUnmount(() => {
    stopActiveWatch()
    stopSoundWatch()
    window.removeEventListener('keydown', onKeydown)
    window.removeEventListener('hashchange', openFromHash)
    if (active.value === 'kumafy') sound.stopMusic()
  })

  return { open, close, openFromHash }
}
