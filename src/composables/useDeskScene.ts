import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import type * as ThreeModule from 'three'
import type { DeskItemId } from '@/scenes/deskItems'
import { hasHardwareWebGL } from '@/scenes/gpu'

interface DeskSceneOptions {
  canvas: Ref<HTMLCanvasElement | null>
  labels: Ref<Partial<Record<DeskItemId, HTMLElement>>>
  screenshot?: (id: DeskItemId) => string | undefined
  onReady?: () => void
  onFail?: () => void
}

export function useDeskScene({ canvas, labels, screenshot, onReady, onFail }: DeskSceneOptions) {
  const hovered = ref<DeskItemId | null>(null)
  const active = ref<DeskItemId | null>(null)
  const introDone = ref(false)
  let cleanup: (() => void) | null = null

  onMounted(async () => {
    const wideScreen = window.matchMedia('(min-width: 768px)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canvas.value) return
    if (!wideScreen || reduceMotion || !hasHardwareWebGL()) {
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

    const desk = buildDesk(THREE, { screenshot })
    const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100)
    const viewDirection = new THREE.Vector3(14.2, 9.9, 15.8).normalize()
    const cameraBase = new THREE.Vector3()
    const screenRight = new THREE.Vector3().crossVectors(camera.up, viewDirection).normalize()
    const lookTarget = desk.center.clone()
    const lookCurrent = desk.center.clone()
    const zoomTarget = new THREE.Vector3()
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2)
    let baseDistance = 0

    const focusPoints = new Map(
      desk.items.map((item) => {
        const sphere = new THREE.Box3()
          .setFromObject(item.object)
          .getBoundingSphere(new THREE.Sphere())
        return [item.id, sphere]
      }),
    )

    function applyTheme(instant = false) {
      desk.applyTheme(document.documentElement.classList.contains('dark'), instant)
    }
    applyTheme(true)
    const themeObserver = new MutationObserver(() => applyTheme())
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
      baseDistance = far
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
      aimCamera(active.value)
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

    function aimCamera(id: DeskItemId | null) {
      const focus = id ? focusPoints.get(id) : undefined
      if (!focus) {
        lookTarget.copy(desk.center)
        zoomTarget.copy(cameraBase)
        return
      }
      const panelWidth = 24 * 16
      const covered = Math.min(0.7, panelWidth / el.clientWidth)
      const visibleWidth = Math.min(1, camera.aspect * (1 - covered))
      const distance = THREE.MathUtils.clamp(
        (focus.radius * 1.2) / (Math.tan(halfFov) * visibleWidth),
        5,
        baseDistance * 0.7,
      )
      const halfWidth = distance * Math.tan(halfFov) * camera.aspect
      lookTarget.copy(focus.center).addScaledVector(screenRight, halfWidth * covered)
      zoomTarget.copy(lookTarget).addScaledVector(viewDirection, distance)
    }
    aimCamera(null)

    const stopActiveWatch = watch(active, (id) => {
      if (id) desk.react(id)
      aimCamera(id)
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
    let elapsed = 0
    let frameId = 0
    let firstFrame = true
    function animate(timestamp: number) {
      frameId = requestAnimationFrame(animate)
      if (!visible || document.hidden) return
      timer.update(timestamp)
      const delta = Math.min(timer.getDelta(), 0.1)
      elapsed += delta
      const follow = 1 - Math.exp(-3.5 * delta)
      desk.update(elapsed, { hovered: hovered.value, active: active.value })
      if (!introDone.value && elapsed > desk.introDuration) introDone.value = true

      const sway = active.value ? 0.25 : 1
      cameraTarget
        .set(parallax.x * 0.9, parallax.y * 0.5, -parallax.x * 0.6)
        .multiplyScalar(sway)
        .add(zoomTarget)
      camera.position.lerp(cameraTarget, follow)
      lookCurrent.lerp(lookTarget, follow)
      camera.lookAt(lookCurrent)

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

  return { hovered, active, introDone }
}
