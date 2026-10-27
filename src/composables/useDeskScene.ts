import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import type * as ThreeModule from 'three'
import type { DeskItemId } from '@/scenes/desk'

interface DeskSceneOptions {
  canvas: Ref<HTMLCanvasElement | null>
  labels: Ref<Partial<Record<DeskItemId, HTMLElement>>>
  onReady?: () => void
  onFail?: () => void
}

export function useDeskScene({ canvas, labels, onReady, onFail }: DeskSceneOptions) {
  const hovered = ref<DeskItemId | null>(null)
  const active = ref<DeskItemId | null>(null)
  let cleanup: (() => void) | null = null

  onMounted(async () => {
    const wideScreen = window.matchMedia('(min-width: 768px)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canvas.value) return
    if (!wideScreen || reduceMotion) {
      onFail?.()
      return
    }

    let THREE: typeof ThreeModule
    let buildDesk: typeof import('@/scenes/desk').buildDesk
    try {
      ;[THREE, { buildDesk }] = await Promise.all([import('three'), import('@/scenes/desk')])
    } catch {
      onFail?.()
      return
    }
    const el = canvas.value
    if (!el) return

    let renderer: ThreeModule.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: true })
    } catch {
      onFail?.()
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.transmissionResolutionScale = 0.5
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    const desk = buildDesk(THREE)
    const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100)
    const viewDirection = new THREE.Vector3(14.2, 9.9, 15.8).normalize()
    const cameraBase = new THREE.Vector3()
    const lookTarget = desk.center.clone()
    const lookCurrent = desk.center.clone()

    function applyTheme() {
      desk.applyTheme(document.documentElement.classList.contains('dark'))
    }
    applyTheme()
    const themeObserver = new MutationObserver(applyTheme)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    function roomFits(distance: number) {
      camera.position.copy(desk.center).addScaledVector(viewDirection, distance)
      camera.lookAt(desk.center)
      camera.updateMatrixWorld()
      return desk.bounds.every((point) => {
        const projected = point.clone().project(camera)
        return Math.abs(projected.x) <= 0.9 && Math.abs(projected.y) <= 0.9
      })
    }

    function fitCamera() {
      let near = 8
      let far = 80
      for (let step = 0; step < 24; step++) {
        const middle = (near + far) / 2
        if (roomFits(middle)) far = middle
        else near = middle
      }
      cameraBase.copy(desk.center).addScaledVector(viewDirection, far)
      camera.position.copy(cameraBase)
      camera.lookAt(lookCurrent)
    }

    function resize() {
      const { clientWidth: width, clientHeight: height } = el
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      fitCamera()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(el)
    resize()

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const parallax = new THREE.Vector2()
    const objects = desk.items.map((item) => item.object)

    function onPointerMove(event: PointerEvent) {
      const rect = el.getBoundingClientRect()
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      )
      if (event.pointerType === 'mouse') parallax.copy(pointer)
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(objects, true)[0]
      hovered.value = (hit?.object.userData.itemId as DeskItemId | undefined) ?? null
      el.style.cursor = hovered.value ? 'pointer' : ''
    }

    function onPointerLeave() {
      hovered.value = null
      parallax.set(0, 0)
    }

    function onClick() {
      active.value = hovered.value
    }

    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerleave', onPointerLeave)
    el.addEventListener('click', onClick)

    const stopActiveWatch = watch(active, (id) => {
      const item = desk.items.find((candidate) => candidate.id === id)
      lookTarget.copy(desk.center)
      if (item) lookTarget.lerp(item.anchor, 0.35)
    })

    let visible = true
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
    })
    intersectionObserver.observe(el)

    const projected = new THREE.Vector3()
    function placeLabels() {
      const { clientWidth: width, clientHeight: height } = el
      for (const item of desk.items) {
        const label = labels.value[item.id]
        if (!label) continue
        projected.copy(item.anchor).project(camera)
        label.style.left = `${(projected.x * 0.5 + 0.5) * width}px`
        label.style.top = `${(-projected.y * 0.5 + 0.5) * height}px`
      }
    }

    const cameraTarget = new THREE.Vector3()
    const timer = new THREE.Timer()
    let frameId = 0
    let firstFrame = true
    function animate(timestamp: number) {
      frameId = requestAnimationFrame(animate)
      if (!visible || document.hidden) return
      timer.update(timestamp)
      desk.update(timer.getElapsed())

      cameraTarget
        .copy(cameraBase)
        .add(new THREE.Vector3(parallax.x * 0.9, parallax.y * 0.5, -parallax.x * 0.6))
      if (active.value) cameraTarget.lerp(desk.center, 0.08)
      camera.position.lerp(cameraTarget, 0.06)
      lookCurrent.lerp(lookTarget, 0.06)
      camera.lookAt(lookCurrent)

      for (const item of desk.items) {
        const lifted = item.id === hovered.value || item.id === active.value
        const targetY = item.baseY + (lifted ? 0.12 : 0)
        item.object.position.y += (targetY - item.object.position.y) * 0.15
      }

      renderer.render(desk.scene, camera)
      placeLabels()
      if (firstFrame) {
        firstFrame = false
        onReady?.()
      }
    }
    frameId = requestAnimationFrame(animate)

    cleanup = () => {
      cancelAnimationFrame(frameId)
      stopActiveWatch()
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerleave', onPointerLeave)
      el.removeEventListener('click', onClick)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      themeObserver.disconnect()
      desk.dispose()
      renderer.dispose()
    }
  })

  onUnmounted(() => cleanup?.())

  return { hovered, active }
}
