import type { Directive } from 'vue'

interface PausableElement extends HTMLElement {
  _offscreenObserver?: IntersectionObserver
}

export const vPauseOffscreen: Directive<PausableElement> = {
  mounted(el) {
    const observer = new IntersectionObserver(([entry]) => {
      el.classList.toggle('is-offscreen', !entry?.isIntersecting)
    })
    observer.observe(el)
    el._offscreenObserver = observer
  },
  unmounted(el) {
    el._offscreenObserver?.disconnect()
  },
  getSSRProps() {
    return {}
  },
}
