import { ref } from 'vue'

type Theme = 'light' | 'dark'

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

export function useTheme() {
  function init() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.value = readStoredTheme() ?? (prefersDark ? 'dark' : 'light')
    applyTheme(theme.value)
  }

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme(theme.value)
    try {
      localStorage.setItem(STORAGE_KEY, theme.value)
    } catch {
      // Si el navegador bloquea el almacenamiento, el tema sigue funcionando
    }
  }

  return { theme, init, toggle }
}