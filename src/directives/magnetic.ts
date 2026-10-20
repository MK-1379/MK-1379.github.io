import type { Directive } from 'vue'

interface MagneticElement extends HTMLElement {
  _magneticCleanup?: () => void
}

const STRENGTH = 0.3
const MAX_OFFSET = 10

export const vMagnetic: Directive<MagneticElement> = {
  mounted(el) {
    el.classList.add('magnetic')

    function onMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const rect = el.getBoundingClientRect()
      const offsetX = (event.clientX - (rect.left + rect.width / 2)) * STRENGTH
      const offsetY = (event.clientY - (rect.top + rect.height / 2)) * STRENGTH
      el.style.setProperty('--magnetic-x', `${Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offsetX))}px`)
      el.style.setProperty('--magnetic-y', `${Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offsetY))}px`)
    }

    function onLeave() {
      el.style.removeProperty('--magnetic-x')
      el.style.removeProperty('--magnetic-y')
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    el._magneticCleanup = () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  },
  unmounted(el) {
    el._magneticCleanup?.()
  },
  getSSRProps() {
    return {}
  },
}
