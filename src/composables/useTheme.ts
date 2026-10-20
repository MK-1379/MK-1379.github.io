import { nextTick, ref } from 'vue'

type Theme = 'light' | 'dark'

interface Point {
  x: number
  y: number
}

const STORAGE_KEY = 'theme'
const theme = ref<Theme>('dark')

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function applyTheme(value: Theme) {
  document.documentElement.classList.toggle('dark', value === 'dark')
}

function saveTheme(value: Theme) {
  theme.value = value
  applyTheme(value)
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
  }
}

export function useTheme() {
  function init() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.value = readStoredTheme() ?? (prefersDark ? 'dark' : 'light')
    applyTheme(theme.value)
  }

  function toggle(origin?: Point) {
    const next: Theme = theme.value === 'dark' ? 'light' : 'dark'
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || !('startViewTransition' in document)) {
      saveTheme(next)
      return
    }

    const center = origin ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const radius = Math.hypot(
      Math.max(center.x, window.innerWidth - center.x),
      Math.max(center.y, window.innerHeight - center.y),
    )

    const transition = document.startViewTransition(async () => {
      saveTheme(next)
      await nextTick()
    })

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${center.x}px ${center.y}px)`,
              `circle(${radius}px at ${center.x}px ${center.y}px)`,
            ],
          },
          {
            duration: 650,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })
      .catch(() => {})
  }

  return { theme, init, toggle }
}
