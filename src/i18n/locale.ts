import { computed, ref } from 'vue'
import { messages } from '@/i18n/messages'

export type Locale = 'es' | 'en'

export interface Localized {
  es: string
  en: string
}

const STORAGE_KEY = 'locale'

const locale = ref<Locale>('es')

function readStoredLocale(): Locale | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'es' || value === 'en' ? value : null
  } catch {
    return null
  }
}

function applyToDocument(value: Locale) {
  document.documentElement.lang = value
  document.title = messages[value].meta.title
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', messages[value].meta.description)
}

function setLocale(value: Locale) {
  locale.value = value
  applyToDocument(value)
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
  }
}

export function useLocale() {
  function initLocale() {
    const stored = readStoredLocale()
    const browserPrefersEnglish = navigator.language.toLowerCase().startsWith('en')
    const initial: Locale = stored ?? (browserPrefersEnglish ? 'en' : 'es')
    locale.value = initial
    applyToDocument(initial)
  }

  function toggleLocale() {
    setLocale(locale.value === 'es' ? 'en' : 'es')
  }

  function tr(value: Localized | string): string {
    return typeof value === 'string' ? value : value[locale.value]
  }

  const t = computed(() => messages[locale.value])

  return { locale, t, tr, initLocale, toggleLocale }
}
