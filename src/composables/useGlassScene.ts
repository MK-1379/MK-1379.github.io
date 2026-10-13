import { onMounted, onUnmounted, type Ref } from 'vue'
import type * as ThreeModule from 'three'


type Three = typeof ThreeModule

export interface GlassFigure {
  object: ThreeModule.Object3D
  update?: (seconds: number) => void
  dispose: () => void
}

interface GlassSceneOptions {
  canvas: Ref<HTMLCanvasElement | null>
  build: (three: Three, material: ThreeModule.MeshPhysicalMaterial) => GlassFigure
  background?: boolean
  cameraDistance?: number
  minHalfWidth?: number
  onReady?: () => void
  onFail?: () => void
}

function readColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function withAlpha(hex: string, alpha: number) {
  const value = parseInt(hex.slice(1), 16)
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`
}

export function useGlassScene({
  canvas,
  build,
  background = false,
  cameraDistance = 10,
  minHalfWidth = 0,
  onReady,
  onFail,
}: GlassSceneOptions) {
  let cleanup: (() => void) | null = null

  onMounted(async () => {
    const wideScreen = window.matchMedia('(min-width: 768px)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!wideScreen || reduceMotion || !canvas.value) return

    let THREE: Three
    let RoomEnvironment: typeof import('three/addons/environments/RoomEnvironment.js').RoomEnvironment
    try {
      ;[THREE, { RoomEnvironment }] = await Promise.all([
        import('three'),
        import('three/addons/environments/RoomEnvironment.js'),
      ])
    } catch {
      onFail?.()
      return
    }
    const el = canvas.value
    if (!el) return

    let renderer: ThreeModule.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: !background })
    } catch {
      onFail?.()
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.transmissionResolutionScale = 0.5
    renderer.toneMapping = THREE.ACESFilmicToneMapping

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 0, cameraDistance)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTexture

    const lightA = new THREE.PointLight(0xffffff, 40, 20)
    lightA.position.set(-3, 2.5, 3)
    const lightB = new THREE.PointLight(0xffffff, 40, 20)
    lightB.position.set(3, -2, 2)
    scene.add(lightA, lightB)

    const material = new THREE.MeshPhysicalMaterial({
      metalness: 0,
      roughness: 0.05,
      transmission: 1,
      thickness: 1.2,
      ior: 1.45,
      attenuationDistance: 2.5,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    })

    const glowCanvas = document.createElement('canvas')
    glowCanvas.width = glowCanvas.height = 256
    const glowTexture = new THREE.CanvasTexture(glowCanvas)
    glowTexture.colorSpace = THREE.SRGBColorSpace
    const glowMaterial = new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    })
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowMaterial)
    glow.position.z = -3
    glow.visible = background
    scene.add(glow)

    const backdropMaterial = new THREE.MeshBasicMaterial({ toneMapped: false, depthWrite: false })
    const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), backdropMaterial)
    backdrop.position.z = -6
    backdrop.visible = !background
    backdrop.onBeforeRender = (currentRenderer) => {
      backdropMaterial.colorWrite = currentRenderer.getRenderTarget() !== null
    }
    scene.add(backdrop)

    function drawGlow(color: string, opacity: number) {
      const ctx = glowCanvas.getContext('2d')
      if (!ctx) return
      const size = glowCanvas.width
      ctx.clearRect(0, 0, size, size)
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, withAlpha(color, 0))
      ctx.globalAlpha = opacity
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, size, size)
      glowTexture.needsUpdate = true
    }

    function applyThemeColors() {
      const accent = new THREE.Color(readColor('--accent'))
      const pageColor = new THREE.Color(readColor('--bg'))
      scene.background = background ? pageColor : null
      backdropMaterial.color = pageColor
      material.attenuationColor = accent
      lightA.color = accent
      lightB.color = new THREE.Color(readColor('--accent-2'))
      const dark = document.documentElement.classList.contains('dark')
      material.emissive = accent
      material.emissiveIntensity = dark ? 0.35 : 0
      lightA.intensity = lightB.intensity = dark ? 90 : 40
      if (background) drawGlow(readColor('--accent-2'), dark ? 0.2 : 0.14)
    }
    applyThemeColors()
    const themeObserver = new MutationObserver(applyThemeColors)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const figure = build(THREE, material)
    const holder = new THREE.Group()
    holder.add(figure.object)
    scene.add(holder)

    function resize() {
      const { clientWidth: width, clientHeight: height } = el
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
      camera.position.z = Math.max(cameraDistance, minHalfWidth / (tanHalfFov * camera.aspect))
      camera.updateProjectionMatrix()

      const distance = camera.position.z - glow.position.z
      const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distance
      const halfWidth = halfHeight * camera.aspect
      glow.scale.setScalar(halfWidth * 2.6)
      glow.position.x = halfWidth * 0.85
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(el)
    resize()

    const tilt = { x: 0, y: 0 }
    function onPointerMove(event: PointerEvent) {
      tilt.x = (event.clientY / window.innerHeight - 0.5) * 0.5
      tilt.y = (event.clientX / window.innerWidth - 0.5) * 0.7
    }
    window.addEventListener('pointermove', onPointerMove)

    let visible = true
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
    })
    intersectionObserver.observe(el)

    const timer = new THREE.Timer()
    let frameId = 0
    let firstFrame = true
    function animate(timestamp: number) {
      frameId = requestAnimationFrame(animate)
      if (!visible || document.hidden) return
      timer.update(timestamp)
      const seconds = timer.getElapsed()

      holder.rotation.x += (tilt.x - holder.rotation.x) * 0.05
      holder.rotation.y += (tilt.y - holder.rotation.y) * 0.05
      holder.position.y = Math.sin(seconds * 0.8) * 0.1
      figure.update?.(seconds)

      renderer.render(scene, camera)
      if (firstFrame) {
        firstFrame = false
        onReady?.()
      }
    }
    frameId = requestAnimationFrame(animate)

    cleanup = () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', onPointerMove)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      themeObserver.disconnect()
      figure.dispose()
      backdrop.geometry.dispose()
      backdropMaterial.dispose()
      glow.geometry.dispose()
      glowMaterial.dispose()
      glowTexture.dispose()
      material.dispose()
      envTexture.dispose()
      pmrem.dispose()
      renderer.dispose()
    }
  })

  onUnmounted(() => cleanup?.())
}
