<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const links = [
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Skills', href: '#skills' },
  { label: 'Sobre mí', href: '#sobre-mi' },
  { label: 'Contacto', href: '#contacto' },
]

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMenu()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-muted/20 bg-bg/80 backdrop-blur">
    <a
      href="#contenido"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-text"
    >
      Saltar al contenido
    </a>

    <nav aria-label="Principal" class="mx-auto max-w-6xl px-6">
      <div class="flex items-center justify-between py-4">
        <a href="#" class="font-display text-lg font-semibold text-text">Mario Díaz</a>

        <div class="flex items-center gap-2 md:gap-6">
          <ul class="hidden items-center gap-6 md:flex">
            <li v-for="link in links" :key="link.href">
              <a :href="link.href" class="text-sm text-muted transition-colors hover:text-text">
                {{ link.label }}
              </a>
            </li>
          </ul>

          <ThemeToggle />

          <button
            type="button"
            class="rounded-md p-2 text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
            :aria-expanded="menuOpen"
            aria-controls="menu-movil"
            :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
            @click="toggleMenu"
          >
            <svg
              v-if="!menuOpen"
              width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <svg
              v-else
              width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>

        <Transition
        enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
        enter-from-class="-translate-y-2 opacity-0"
        leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
        leave-to-class="-translate-y-2 opacity-0"
        >
        <ul v-show="menuOpen" id="menu-movil" class="border-t border-muted/20 py-2 md:hidden">
            <li v-for="link in links" :key="link.href">
            <a
                :href="link.href"
                class="block py-3 text-base text-text transition-colors hover:text-accent"
                @click="closeMenu"
            >
                {{ link.label }}
            </a>
            </li>
        </ul>
        </Transition>
    </nav>
  </header>
</template>