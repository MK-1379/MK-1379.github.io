import { computed, ref } from 'vue'
import { messages } from '@/i18n/messages'

export type Locale = 'es' | 'en'

/** Texto en los dos idiomas. Se escribe junto en los datos para no olvidar traducir nada. */
export interface Localized {
  es: string
  en: string
}

const STORAGE_KEY = 'locale'

// Estado compartido: todos los componentes ven el mismo idioma.
// Empieza en español porque es el idioma del HTML prerenderizado.
const locale = ref<Locale>('es')

function readStoredLocale(): Locale | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'es' || value === 'en' ? value : null
  } catch {
    return null
  }
}

// Actualiza lo que está fuera de Vue: idioma del documento, título y descripción
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
    // Si el navegador bloquea el almacenamiento, el cambio funciona igual en esta visita
  }
}

export function useLocale() {
  /** Se llama una vez al montar la app: preferencia guardada o, si no hay, idioma del navegador */
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

  /** Devuelve el texto en el idioma actual. Los textos iguales en ambos idiomas pueden ser un string normal. */
  function tr(value: Localized | string): string {
    return typeof value === 'string' ? value : value[locale.value]
  }

  const t = computed(() => messages[locale.value])

  return { locale, t, tr, initLocale, toggleLocale }
}
