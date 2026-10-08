import { onMounted, onUnmounted, type Ref } from 'vue'
import type * as ThreeModule from 'three'

// Lógica común de las escenas 3D de cristal (hero y experiencia): renderizador,
// luces, material de cristal, colores del tema, ratón, pausa fuera de pantalla y limpieza.
// Cada componente solo decide qué figura dibuja y cómo se mueve.
// Three.js se carga solo en el navegador (import dinámico), así no frena la carga
// de la página ni rompe el prerenderizado de vite-ssg.

type Three = typeof ThreeModule

export interface GlassFigure {
  object: ThreeModule.Object3D
  // Se llama en cada fotograma con los segundos transcurridos
  update?: (seconds: number) => void
  dispose: () => void
}

interface GlassSceneOptions {
  canvas: Ref<HTMLCanvasElement | null>
  // Crea la figura con el material de cristal compartido
  build: (three: Three, material: ThreeModule.MeshPhysicalMaterial) => GlassFigure
  // Fondo del color de la página y foco de luz en el borde derecho (hero).
  // Si es false, el canvas es transparente y se ve la página detrás.
  background?: boolean
  // Distancia de la cámara: cuanto mayor, más pequeña se ve la figura y más margen queda
  cameraDistance?: number
  // Ancho mínimo (en unidades de la escena, a cada lado del centro) que debe caber en el
  // canvas. Si el canvas es estrecho, la cámara se aleja lo necesario para que no se corte
  minHalfWidth?: number
  onReady?: () => void
  // Se llama si la escena no puede mostrarse (sin WebGL o sin conexión para descargar Three.js)
  onFail?: () => void
}

function readColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

// '#3b82f6' → 'rgba(59, 130, 246, 0)'
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
  // Todo lo que hay que deshacer al desmontar el componente
  let cleanup: (() => void) | null = null

  onMounted(async () => {
    // En móvil o con "reducir movimiento" se queda la imagen que haya en su lugar.
    // Esta condición debe coincidir con la media query de .scene-fallback en main.css
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
      onFail?.() // no se pudo descargar Three.js
      return
    }
    const el = canvas.value
    if (!el) return // el componente se desmontó mientras cargaba

    let renderer: ThreeModule.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: !background })
    } catch {
      onFail?.() // sin WebGL
      return
    }
    // Rendimiento: como mucho 1,5 píxeles reales por píxel CSS, y el cristal calcula
    // lo que hay detrás a media resolución (no se nota porque está difuminado)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.transmissionResolutionScale = 0.5
    renderer.toneMapping = THREE.ACESFilmicToneMapping

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 0, cameraDistance)

    // Entorno de luz para que el cristal tenga reflejos
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTexture

    // Dos luces con los colores de acento de la web
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

    // Foco de luz en el borde derecho, como las manchas de color del resto de la página
    // (.ambient-blob en main.css). Con fondo opaco el canvas tapa esas manchas, así que el
    // foco va dentro de la escena: un plano con un degradado radial dibujado en un canvas 2D.
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

    // Fondo que solo ve el cristal (escenas con canvas transparente).
    // Para dibujar el cristal, Three.js primero pinta lo que hay detrás en una textura
    // aparte. Si el canvas es transparente, en esa textura pone blanco al 50 % y el cristal
    // sale más claro que en el hero. Este plano del color de la página se pinta solo en
    // esa textura: en la pasada final no escribe color, así que el canvas sigue transparente.
    const backdropMaterial = new THREE.MeshBasicMaterial({ toneMapped: false, depthWrite: false })
    const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), backdropMaterial)
    backdrop.position.z = -6
    backdrop.visible = !background
    backdrop.onBeforeRender = (currentRenderer) => {
      // Con un render target activo estamos en la pasada del cristal; sin él, en la final
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
      // El borde se funde al mismo color con opacidad 0; con 'transparent' (negro
      // transparente) el degradado se oscurecería al llegar al borde
      gradient.addColorStop(1, withAlpha(color, 0))
      ctx.globalAlpha = opacity
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, size, size)
      glowTexture.needsUpdate = true
    }

    // El fondo de la escena y los tonos del cristal salen de las variables CSS del tema
    function applyThemeColors() {
      const accent = new THREE.Color(readColor('--accent'))
      const pageColor = new THREE.Color(readColor('--bg'))
      scene.background = background ? pageColor : null
      backdropMaterial.color = pageColor
      material.attenuationColor = accent
      lightA.color = accent
      lightB.color = new THREE.Color(readColor('--accent-2'))
      // Sobre fondo oscuro el cristal apenas refleja nada: se le da un brillo propio morado
      const dark = document.documentElement.classList.contains('dark')
      material.emissive = accent
      material.emissiveIntensity = dark ? 0.35 : 0
      lightA.intensity = lightB.intensity = dark ? 90 : 40
      // Misma opacidad que --blob-opacity en main.css
      if (background) drawGlow(readColor('--accent-2'), dark ? 0.2 : 0.14)
    }
    applyThemeColors()
    const themeObserver = new MutationObserver(applyThemeColors)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    // Ojo: para cambiar el tamaño de una figura, cambia el de su geometría y no uses
    // object.scale. El grosor del cristal (thickness) se multiplica por la escala del
    // objeto, y una figura escalada absorbe más luz y sale de un color más intenso.
    const figure = build(THREE, material)
    // Contenedor que inclina el ratón, separado de los giros propios de la figura
    const holder = new THREE.Group()
    holder.add(figure.object)
    scene.add(holder)

    function resize() {
      const { clientWidth: width, clientHeight: height } = el
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      // Ancho visible a una distancia d: tan(fov / 2) * d * aspect. Despejando d sale la
      // distancia mínima para que quepa minHalfWidth; nunca más cerca que cameraDistance
      const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
      camera.position.z = Math.max(cameraDistance, minHalfWidth / (tanHalfFov * camera.aspect))
      camera.updateProjectionMatrix()

      // Tamaño y posición del foco según lo que ve la cámara a su profundidad:
      // mide algo más que el ancho visible y su centro queda junto al borde derecho
      const distance = camera.position.z - glow.position.z
      const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distance
      const halfWidth = halfHeight * camera.aspect
      glow.scale.setScalar(halfWidth * 2.6)
      glow.position.x = halfWidth * 0.85
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(el)
    resize()

    // El ratón inclina la figura un poco
    const tilt = { x: 0, y: 0 }
    function onPointerMove(event: PointerEvent) {
      tilt.x = (event.clientY / window.innerHeight - 0.5) * 0.5
      tilt.y = (event.clientX / window.innerWidth - 0.5) * 0.7
    }
    window.addEventListener('pointermove', onPointerMove)

    // Solo se dibuja cuando la escena está en pantalla y la pestaña visible
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
