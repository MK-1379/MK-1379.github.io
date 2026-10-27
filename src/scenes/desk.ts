import type * as ThreeModule from 'three'
import type { DeskItemId } from '@/scenes/deskItems'

type Three = typeof ThreeModule

export interface DeskItem {
  id: DeskItemId
  object: ThreeModule.Group
  anchor: ThreeModule.Vector3
  baseY: number
}

export interface DeskState {
  hovered: DeskItemId | null
  active: DeskItemId | null
}

export interface DeskOptions {
  screenshot?: (id: DeskItemId) => string | undefined
}

export interface Desk {
  scene: ThreeModule.Scene
  items: DeskItem[]
  bounds: ThreeModule.Vector3[]
  center: ThreeModule.Vector3
  introDuration: number
  update: (seconds: number, state: DeskState) => void
  react: (id: DeskItemId) => void
  applyTheme: (dark: boolean, instant?: boolean) => void
  dispose: () => void
}

const lightColors = {
  floor: 0xece6fb,
  edge: 0xc9b8f2,
  wall: 0xf6f2ff,
  wood: 0xd9ccf5,
  rug: 0xd8c8fb,
}
const darkColors = {
  floor: 0x221b3d,
  edge: 0x3b2f6b,
  wall: 0x1b1631,
  wood: 0x3a3063,
  rug: 0x2e2554,
}

function drawCanvas(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (ctx) draw(ctx)
  return canvas
}

const chartPoints = [40, 70, 55, 95, 88, 120, 110, 150, 140, 135, 170]
const codeLines = ['const games = await', '  riot.matches(puuid)', '', 'chart(games)']

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function progress(seconds: number, start: number, duration: number) {
  return clamp01((seconds - start) / duration)
}

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3
}

function easeOutBack(value: number) {
  const overshoot = 1.70158
  return 1 + (overshoot + 1) * (value - 1) ** 3 + overshoot * (value - 1) ** 2
}

function easeOutBounce(value: number) {
  const strength = 7.5625
  const step = 2.75
  if (value < 1 / step) return strength * value ** 2
  if (value < 2 / step) return strength * (value - 1.5 / step) ** 2 + 0.75
  if (value < 2.5 / step) return strength * (value - 2.25 / step) ** 2 + 0.9375
  return strength * (value - 2.625 / step) ** 2 + 0.984375
}

function drawScreen(ctx: CanvasRenderingContext2D, seconds: number) {
  ctx.setTransform(2, 0, 0, 2, 0, 0)
  const gradient = ctx.createLinearGradient(0, 0, 512, 300)
  gradient.addColorStop(0, '#1e1b3a')
  gradient.addColorStop(1, '#312a63')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 300)
  ctx.fillStyle = '#a78bfa'
  ctx.font = '700 26px sans-serif'
  ctx.fillText('LoLStats', 26, 44)
  ctx.fillStyle = '#c4b5fd'
  ctx.font = '16px monospace'
  ctx.fillText('Diamante IV', 26, 72)

  const drawn = easeOutCubic(progress(seconds, 0.3, 2.4)) * (chartPoints.length - 1)
  const point = (index: number) => ({ x: 26 + index * 26, y: 250 - (chartPoints[index] ?? 0) })
  ctx.strokeStyle = '#8b5cf6'
  ctx.lineWidth = 4
  ctx.lineJoin = 'round'
  ctx.beginPath()
  const start = point(0)
  ctx.moveTo(start.x, start.y)
  const whole = Math.floor(drawn)
  for (let index = 1; index <= whole; index++) {
    const next = point(index)
    ctx.lineTo(next.x, next.y)
  }
  const from = point(whole)
  const to = point(Math.min(whole + 1, chartPoints.length - 1))
  const head = {
    x: from.x + (to.x - from.x) * (drawn - whole),
    y: from.y + (to.y - from.y) * (drawn - whole),
  }
  ctx.lineTo(head.x, head.y)
  ctx.stroke()
  ctx.fillStyle = '#ede9fe'
  ctx.beginPath()
  ctx.arc(head.x, head.y, 6, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#16132c'
  ctx.fillRect(318, 26, 170, 210)
  ctx.font = '13px monospace'
  let typed = Math.floor(Math.max(0, seconds - 1) * 16)
  let cursor = { x: 330, y: 52 }
  codeLines.forEach((line, index) => {
    const visible = line.slice(0, Math.max(0, typed))
    typed -= line.length
    const y = 52 + index * 22
    ctx.fillStyle = index === 3 ? '#4ade80' : '#c4b5fd'
    ctx.fillText(visible, 330, y)
    if (visible.length > 0 || index === 0) cursor = { x: 330 + ctx.measureText(visible).width, y }
  })
  if (Math.floor(seconds * 2.5) % 2 === 0) {
    ctx.fillStyle = '#ede9fe'
    ctx.fillRect(cursor.x + 2, cursor.y - 12, 7, 15)
  }

  ctx.fillStyle = '#4ade80'
  ctx.beginPath()
  ctx.arc(336, 214, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#c4b5fd'
  ctx.fillText('online', 348, 219)
}

function drawScreenshot(ctx: CanvasRenderingContext2D, image: HTMLImageElement, alpha: number) {
  const { width, height } = ctx.canvas
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight)
  const imageWidth = image.naturalWidth * scale
  const imageHeight = image.naturalHeight * scale
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.globalAlpha = alpha
  ctx.fillStyle = '#16132c'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(
    image,
    (width - imageWidth) / 2,
    (height - imageHeight) / 2,
    imageWidth,
    imageHeight,
  )
  ctx.globalAlpha = 1
}

function drawNote(ctx: CanvasRenderingContext2D, symbol: string) {
  ctx.fillStyle = '#a78bfa'
  ctx.font = '700 52px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(symbol, 32, 34)
}

function drawGlow(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255, 230, 190, 0.9)')
  gradient.addColorStop(0.35, 'rgba(255, 210, 160, 0.35)')
  gradient.addColorStop(1, 'rgba(255, 200, 150, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
}

function drawDuotone(ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  const size = ctx.canvas.width
  ctx.drawImage(image, 0, 0, size, size)
  const pixels = ctx.getImageData(0, 0, size, size)
  const shadow = [46, 16, 101]
  const highlight = [237, 231, 251]
  for (let index = 0; index < pixels.data.length; index += 4) {
    const red = pixels.data[index] ?? 0
    const green = pixels.data[index + 1] ?? 0
    const blue = pixels.data[index + 2] ?? 0
    const light = (red * 0.299 + green * 0.587 + blue * 0.114) / 255
    for (let channel = 0; channel < 3; channel++) {
      const from = shadow[channel] ?? 0
      const to = highlight[channel] ?? 0
      pixels.data[index + channel] = from + (to - from) * light
    }
  }
  ctx.putImageData(pixels, 0, 0)
}

export function buildDesk(THREE: Three, options: DeskOptions = {}): Desk {
  const scene = new THREE.Scene()

  const hemisphere = new THREE.HemisphereLight(0xf3edff, 0x6d4bb8, 1.4)
  scene.add(hemisphere)
  const sun = new THREE.DirectionalLight(0xffffff, 2.2)
  sun.position.set(6, 10, 7)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7 })
  sun.shadow.radius = 4
  sun.shadow.bias = -0.0005
  scene.add(sun)
  const rim = new THREE.PointLight(0x8b5cf6, 18, 12)
  rim.position.set(-3, 4, -2)
  scene.add(rim)

  const materials = {
    floor: new THREE.MeshStandardMaterial({ color: lightColors.floor, roughness: 0.9 }),
    edge: new THREE.MeshStandardMaterial({ color: lightColors.edge, roughness: 0.8 }),
    wall: new THREE.MeshStandardMaterial({ color: lightColors.wall, roughness: 0.95 }),
    wood: new THREE.MeshStandardMaterial({ color: lightColors.wood, roughness: 0.55 }),
    rug: new THREE.MeshStandardMaterial({ color: lightColors.rug, roughness: 1 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x1e1b3a, roughness: 0.4, metalness: 0.2 }),
    white: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }),
    lilac: new THREE.MeshStandardMaterial({
      color: 0xd8c8fb,
      roughness: 0.6,
      side: THREE.DoubleSide,
    }),
    violet: new THREE.MeshStandardMaterial({ color: 0x7c4fd0, roughness: 0.35 }),
    shade: new THREE.MeshStandardMaterial({
      color: 0x7c4fd0,
      roughness: 0.35,
      side: THREE.DoubleSide,
    }),
    bulb: new THREE.MeshStandardMaterial({
      color: 0xfff4e0,
      emissive: 0xffd9a0,
      emissiveIntensity: 0,
    }),
    blue: new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.45 }),
    teal: new THREE.MeshStandardMaterial({ color: 0x0e7490, roughness: 0.5 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xb794f6,
      roughness: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      transmission: 0.35,
      thickness: 0.6,
      ior: 1.4,
    }),
  }

  const themed = (['floor', 'edge', 'wall', 'wood', 'rug'] as const).map((key) => ({
    material: materials[key],
    light: new THREE.Color(lightColors[key]),
    dark: new THREE.Color(darkColors[key]),
  }))

  function addBox(
    size: [number, number, number],
    material: ThreeModule.Material,
    position: [number, number, number],
    parent: ThreeModule.Object3D = scene,
  ) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material)
    mesh.position.set(...position)
    mesh.castShadow = true
    mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }

  function addMesh(
    geometry: ThreeModule.BufferGeometry,
    material: ThreeModule.Material,
    position: [number, number, number],
    parent: ThreeModule.Object3D,
  ) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(...position)
    mesh.castShadow = true
    parent.add(mesh)
    return mesh
  }

  function canvasTexture(canvas: HTMLCanvasElement) {
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }

  function addGroup(parent: ThreeModule.Object3D = scene) {
    const group = new THREE.Group()
    parent.add(group)
    return group
  }

  const floor = addBox([9, 0.35, 7], materials.floor, [0, -0.175, 0])
  const floorEdge = addBox([9, 0.12, 7], materials.edge, [0, -0.41, 0])
  const walls = addGroup()
  addBox([9, 4.6, 0.25], materials.wall, [0, 2.3, -3.375], walls)
  addBox([0.25, 4.6, 7], materials.wall, [-4.375, 2.3, 0], walls)

  const rug = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.03, 48), materials.rug)
  rug.position.set(0.6, 0.015, 1.1)
  rug.receiveShadow = true
  scene.add(rug)

  const table = addGroup()
  addBox([4.6, 0.16, 1.9], materials.wood, [0, 1.55, -2.2], table)
  for (const [x, z] of [
    [-2.15, -3.0],
    [2.15, -3.0],
    [-2.15, -1.4],
    [2.15, -1.4],
  ] as const) {
    addBox([0.12, 1.5, 0.12], materials.wood, [x, 0.75, z], table)
  }

  const items: DeskItem[] = []
  function addItem(id: DeskItemId, object: ThreeModule.Group, anchor: [number, number, number]) {
    object.traverse((child) => {
      child.userData.itemId = id
    })
    scene.add(object)
    items.push({ id, object, anchor: new THREE.Vector3(...anchor), baseY: object.position.y })
  }

  const monitor = new THREE.Group()
  addBox([0.5, 0.06, 0.36], materials.dark, [0, 1.66, -2.55], monitor)
  addBox([0.1, 0.55, 0.1], materials.dark, [0, 1.95, -2.6], monitor)
  addBox([2.3, 1.36, 0.1], materials.dark, [0, 2.75, -2.6], monitor)
  const screenCanvas = drawCanvas(1024, 600, (ctx) => drawScreen(ctx, 0))
  const screenContext = screenCanvas.getContext('2d')
  const screenTexture = canvasTexture(screenCanvas)
  addMesh(
    new THREE.PlaneGeometry(2.16, 1.22),
    new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false }),
    [0, 2.75, -2.545],
    monitor,
  )
  addBox([1.5, 0.05, 0.45], materials.white, [0, 1.655, -1.75], monitor)
  addItem('lolstats', monitor, [0.3, 3.75, -2.6])

  const trophy = new THREE.Group()
  addBox([0.5, 0.14, 0.5], materials.violet, [0, 1.7, 0], trophy)
  addBox([0.32, 0.12, 0.32], materials.violet, [0, 1.83, 0], trophy)
  addMesh(new THREE.CylinderGeometry(0.06, 0.1, 0.35, 16), materials.glass, [0, 2.06, 0], trophy)
  const cupProfile = [
    [0.05, 0],
    [0.22, 0.05],
    [0.32, 0.3],
    [0.34, 0.55],
    [0.31, 0.55],
  ].map(([x, y]) => new THREE.Vector2(x, y))
  addMesh(new THREE.LatheGeometry(cupProfile, 32), materials.glass, [0, 2.22, 0], trophy)
  for (const side of [-1, 1]) {
    const handle = addMesh(
      new THREE.TorusGeometry(0.13, 0.03, 10, 24, Math.PI),
      materials.glass,
      [side * 0.34, 2.5, 0],
      trophy,
    )
    handle.rotation.z = (side * -Math.PI) / 2
  }
  trophy.position.set(1.6, 0, -2.25)
  addItem('bracketly', trophy, [1.6, 3.05, -2.25])

  const speaker = new THREE.Group()
  addBox([0.62, 1.05, 0.55], materials.dark, [0, 2.15, 0], speaker)
  const cones: ThreeModule.Mesh[] = []
  for (const [y, radius] of [
    [2.38, 0.17],
    [1.95, 0.12],
  ] as const) {
    const ring = addMesh(
      new THREE.CylinderGeometry(radius + 0.04, radius + 0.04, 0.04, 28),
      materials.violet,
      [0, y, 0.28],
      speaker,
    )
    ring.rotation.x = Math.PI / 2
    const cone = addMesh(
      new THREE.SphereGeometry(radius, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      materials.glass,
      [0, y, 0.29],
      speaker,
    )
    cone.rotation.x = Math.PI / 2
    cone.scale.y = 0.4
    cones.push(cone)
  }
  const notes = ['♪', '♫', '♪', '♫', '♪'].map((symbol) => {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: canvasTexture(drawCanvas(64, 64, (ctx) => drawNote(ctx, symbol))),
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    )
    sprite.scale.setScalar(0.38)
    sprite.position.set(0, 2.15, 0)
    speaker.add(sprite)
    return sprite
  })
  speaker.position.set(-1.75, 0, -2.45)
  speaker.rotation.y = 0.25
  addItem('kumafy', speaker, [-2.15, 2.85, -1.9])

  const shelf = new THREE.Group()
  addBox([2.4, 0.08, 0.55], materials.wood, [0, 3.3, 0], shelf)
  const bookMaterials = [
    materials.violet,
    materials.blue,
    materials.teal,
    materials.white,
    materials.violet,
  ]
  const books = bookMaterials.map((material, index) => {
    const height = 0.5 + (index % 3) * 0.08
    const book = addBox(
      [0.17, height, 0.42],
      material,
      [-0.95 + index * 0.2, 3.34 + height / 2, 0],
      shelf,
    )
    if (index === bookMaterials.length - 1) {
      book.rotation.z = -0.35
      book.position.x += 0.08
    }
    return { book, baseRotation: book.rotation.z }
  })
  addMesh(new THREE.SphereGeometry(0.22, 32, 16), materials.glass, [0.75, 3.56, 0], shelf)
  shelf.position.set(-2.5, 0, -3.05)
  addItem('clase', shelf, [-2.7, 4.15, -3.05])

  const papers = new THREE.Group()
  const sheets = Array.from({ length: 4 }, (_, index) => {
    const sheet = addBox(
      [0.62, 0.02, 0.86],
      materials.white,
      [(index % 2) * 0.03, 1.65 + index * 0.022, 0],
      papers,
    )
    sheet.rotation.y = (index - 1.5) * 0.06
    return { sheet, baseY: sheet.position.y }
  })
  const lines = addMesh(
    new THREE.PlaneGeometry(0.4, 0.5),
    new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.35 }),
    [0, 1.75, 0],
    papers,
  )
  lines.rotation.x = -Math.PI / 2
  papers.position.set(1.35, 0, -1.65)
  papers.rotation.y = -0.3
  addItem('cv', papers, [1.35, 2.1, -1.55])

  const frame = new THREE.Group()
  addBox([1.15, 1.15, 0.08], materials.violet, [0, 0, 0], frame)
  const photoMaterial = new THREE.MeshBasicMaterial({ color: 0xd8c8fb, toneMapped: false })
  const photo = new Image()
  photo.onload = () => {
    photoMaterial.map = canvasTexture(drawCanvas(256, 256, (ctx) => drawDuotone(ctx, photo)))
    photoMaterial.color.set(0xffffff)
    photoMaterial.needsUpdate = true
  }
  photo.src = '/img/mario-400.webp'
  addMesh(new THREE.PlaneGeometry(0.97, 0.97), photoMaterial, [0, 0, 0.045], frame)
  frame.position.set(-4.2, 2.9, 0.6)
  frame.rotation.y = Math.PI / 2
  addItem('about', frame, [-4.2, 3.75, 0.6])

  const envelope = new THREE.Group()
  addBox([0.8, 0.05, 0.55], materials.white, [0, 0.05, 0], envelope)
  const letter = addBox([0.62, 0.015, 0.4], materials.lilac, [0, 0.05, 0.02], envelope)
  const flapShape = new THREE.Shape(
    [
      [-0.4, 0],
      [0.4, 0],
      [0, -0.3],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
  )
  const flap = addMesh(
    new THREE.ShapeGeometry(flapShape),
    materials.lilac,
    [0, 0.08, -0.275],
    envelope,
  )
  flap.rotation.x = -Math.PI / 2
  const seal = addMesh(
    new THREE.SphereGeometry(0.07, 16, 10),
    materials.violet,
    [0, 0.09, 0.02],
    envelope,
  )
  envelope.position.set(2.1, 0.02, 1.3)
  envelope.rotation.y = -0.4
  addItem('contact', envelope, [2.1, 0.75, 1.3])

  const lamp = addGroup()
  addMesh(new THREE.CylinderGeometry(0.32, 0.36, 0.08, 24), materials.dark, [0, 0.04, 0], lamp)
  addMesh(new THREE.CylinderGeometry(0.035, 0.035, 3.3, 10), materials.dark, [0, 1.69, 0], lamp)
  addMesh(new THREE.SphereGeometry(0.06, 12, 8), materials.dark, [0, 3.34, 0], lamp)
  const lampArm = addMesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.95, 10),
    materials.dark,
    [-0.42, 3.47, 0.16],
    lamp,
  )
  lampArm.rotation.set(0, 0.35, Math.PI / 2 - 0.3)
  const lampHead = addGroup(lamp)
  lampHead.position.set(-0.85, 3.6, 0.32)
  lampHead.rotation.set(-0.3, 0, -0.45)
  addMesh(
    new THREE.CylinderGeometry(0.08, 0.28, 0.34, 24, 1, true),
    materials.shade,
    [0, -0.12, 0],
    lampHead,
  )
  addMesh(new THREE.SphereGeometry(0.09, 16, 10), materials.bulb, [0, -0.22, 0], lampHead)
  const lampLight = new THREE.PointLight(0xffd9a0, 0, 7, 1.6)
  lampLight.position.set(0, -0.32, 0)
  lampHead.add(lampLight)
  const lampGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: canvasTexture(drawCanvas(128, 128, drawGlow)),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  )
  lampGlow.position.set(0, -0.28, 0)
  lampGlow.scale.setScalar(1.6)
  lampHead.add(lampGlow)
  lamp.position.set(3.55, 0, -2.75)

  const chair = new THREE.Group()
  addBox([1, 0.12, 1], materials.violet, [0, 0.95, 0], chair)
  addBox([1, 1, 0.12], materials.violet, [0, 1.5, 0.5], chair)
  addMesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 12), materials.dark, [0, 0.48, 0], chair)
  addMesh(new THREE.CylinderGeometry(0.45, 0.45, 0.06, 20), materials.dark, [0, 0.06, 0], chair)
  chair.position.set(0.1, 0, -0.5)
  chair.rotation.y = 0.35
  scene.add(chair)

  const floaters = [
    [-2.6, 1, 1.7, 0.55],
    [3.3, 1.9, 0.2, 0.32],
    [-0.4, 4.1, -1.2, 0.26],
  ].map(([x = 0, y = 0, z = 0, radius = 0.3]) => {
    const sphere = addMesh(
      new THREE.SphereGeometry(radius, 48, 24),
      materials.glass,
      [x, y, z],
      scene,
    )
    return { sphere, baseY: y }
  })

  const bounds: ThreeModule.Vector3[] = []
  for (const x of [-4.5, 4.5]) {
    for (const y of [-0.47, 4.85]) {
      for (const z of [-3.5, 3.5]) bounds.push(new THREE.Vector3(x, y, z))
    }
  }

  const itemDropStart = 1
  const itemDropGap = 0.12
  const introDuration = itemDropStart + items.length * itemDropGap + 0.8
  const lifts = new Map<DeskItemId, number>(items.map((item) => [item.id, 0]))
  const reactions = new Map<DeskItemId, number>()
  let darkness = 0
  let darknessMix = 0
  let lampSwitchedOn = Number.POSITIVE_INFINITY
  let lampLevel = 0
  let notesLevel = 0
  let flapOpen = 0
  let screenStart = 0
  let lastScreenDraw = -1
  const screenshots = new Map<DeskItemId, HTMLImageElement>()
  let shownScreenshot: HTMLImageElement | undefined
  let screenshotMix = 0
  let now = 0
  let delta = 0

  function damp(current: number, target: number, speed: number) {
    return THREE.MathUtils.damp(current, target, speed, delta)
  }

  function spread(object: ThreeModule.Object3D, amount: number) {
    object.scale.set(Math.max(amount, 0.0001), 1, Math.max(amount, 0.0001))
  }

  function rise(object: ThreeModule.Object3D, amount: number) {
    object.scale.set(1, Math.max(amount, 0.0001), 1)
  }

  function pop(object: ThreeModule.Object3D, amount: number) {
    object.scale.setScalar(Math.max(amount, 0.0001))
  }

  function playIntro(seconds: number) {
    spread(floor, easeOutBack(progress(seconds, 0, 0.55)))
    spread(floorEdge, easeOutBack(progress(seconds, 0, 0.55)))
    rise(walls, easeOutCubic(progress(seconds, 0.3, 0.6)))
    rise(table, easeOutBack(progress(seconds, 0.6, 0.5)))
    spread(rug, easeOutBack(progress(seconds, 0.7, 0.5)))
    pop(chair, easeOutBack(progress(seconds, 0.9, 0.5)))
    pop(lamp, easeOutBack(progress(seconds, 1.4, 0.5)))
    floaters.forEach(({ sphere }, index) => {
      pop(sphere, easeOutBack(progress(seconds, 1.9 + index * 0.1, 0.5)))
    })
  }

  function since(id: DeskItemId) {
    const start = reactions.get(id)
    return start === undefined ? Number.POSITIVE_INFINITY : now - start
  }

  function animateReactions(state: DeskState) {
    const spin = since('bracketly')
    trophy.rotation.y = easeOutCubic(clamp01(spin / 1.2)) * Math.PI * 2

    const shake = since('clase')
    books.forEach(({ book, baseRotation }, index) => {
      const wave = progress(shake, index * 0.08, 0.45)
      book.rotation.z = baseRotation - Math.sin(wave * Math.PI) * 0.28
    })

    const flutter = since('cv')
    sheets.forEach(({ sheet, baseY }, index) => {
      const wave = progress(flutter, index * 0.07, 0.7)
      sheet.position.y = baseY + Math.sin(wave * Math.PI) * 0.18 * (index + 1)
      sheet.rotation.z = Math.sin(wave * Math.PI * 4) * 0.1 * (1 - wave)
    })

    const swing = since('about')
    frame.rotation.z = swing < 3 ? Math.sin(swing * 9) * 0.22 * Math.exp(-swing * 2.2) : 0

    const opening = state.active === 'contact' ? 1 : 0
    flapOpen = damp(flapOpen, opening, 7)
    flap.rotation.x = -Math.PI / 2 - flapOpen * Math.PI * 0.62
    seal.visible = flapOpen < 0.15
    const letterOut = clamp01(flapOpen * 1.6 - 0.6)
    letter.position.y = 0.05 + easeOutCubic(letterOut) * 0.38
    letter.rotation.x = -letterOut * 0.35

    notesLevel = damp(notesLevel, state.active === 'kumafy' ? 1 : 0, 4)
    notes.forEach((note, index) => {
      const phase = (now * 0.55 + index / notes.length) % 1
      note.visible = notesLevel > 0.01
      note.position.set(Math.sin(phase * 6 + index) * 0.25, 2.75 + phase * 1.5, 0.35)
      note.material.opacity = notesLevel * Math.sin(phase * Math.PI)
    })
    const beatStrength = 0.5 + notesLevel * 0.6
    const beat = 1 + Math.max(0, Math.sin(now * 7.5)) ** 4 * beatStrength
    cones.forEach((cone) => {
      cone.scale.y = 0.4 * beat
    })
  }

  function screenshotFor(id: DeskItemId | null) {
    if (!id || !options.screenshot) return undefined
    let image = screenshots.get(id)
    if (!image) {
      const src = options.screenshot(id)
      if (!src) return undefined
      image = new Image()
      image.src = src
      screenshots.set(id, image)
    }
    return image.complete && image.naturalWidth > 0 ? image : undefined
  }

  function updateScreen(state: DeskState) {
    const wanted = screenshotFor(state.active)
    if (wanted && wanted !== shownScreenshot) {
      shownScreenshot = wanted
      screenshotMix = 0
    }
    screenshotMix = damp(screenshotMix, wanted ? 1 : 0, 6)
    if (!screenContext || now - lastScreenDraw < 1 / 20) return
    lastScreenDraw = now
    drawScreen(screenContext, (now - screenStart) % 10)
    if (shownScreenshot && screenshotMix > 0.01) {
      drawScreenshot(screenContext, shownScreenshot, screenshotMix)
    }
    screenTexture.needsUpdate = true
  }

  function updateLighting() {
    darknessMix = damp(darknessMix, darkness, 2.5)
    for (const { material, light, dark } of themed) {
      material.color.lerpColors(light, dark, darknessMix)
    }
    rim.intensity = 18 + 22 * darknessMix
    sun.intensity = 2.2 - 0.9 * darknessMix
    hemisphere.intensity = 1.4 - 0.25 * darknessMix

    const sinceSwitch = now - lampSwitchedOn
    const flicker = sinceSwitch < 0.08 || (sinceSwitch > 0.18 && sinceSwitch < 0.26)
    const lampOn = darkness === 1 && (flicker || sinceSwitch > 0.4)
    lampLevel = damp(lampLevel, lampOn ? 1 : 0, lampOn ? 40 : 5)
    materials.bulb.emissiveIntensity = lampLevel * 3
    lampLight.intensity = lampLevel * 9
    lampGlow.material.opacity = lampLevel * 0.85
  }

  return {
    scene,
    items,
    bounds,
    center: new THREE.Vector3(0, 1.9, 0),
    introDuration,
    update(seconds, state) {
      delta = Math.min(seconds - now, 0.1)
      now = seconds
      playIntro(seconds)
      items.forEach((item, index) => {
        const lifted = item.id === state.hovered || item.id === state.active
        const lift = lifts.get(item.id) ?? 0
        const nextLift = damp(lift, lifted ? 0.12 : 0, 10)
        lifts.set(item.id, nextLift)
        const drop = progress(seconds, itemDropStart + index * itemDropGap, 0.75)
        item.object.position.y = item.baseY + nextLift + (1 - easeOutBounce(drop)) * 2.8
        pop(item.object, drop > 0 ? 1 : 0)
      })
      floaters.forEach(({ sphere, baseY }, index) => {
        sphere.position.y = baseY + Math.sin(seconds * 0.9 + index * 2) * 0.12
      })
      animateReactions(state)
      updateScreen(state)
      updateLighting()
    },
    react(id) {
      reactions.set(id, now)
      if (id === 'lolstats') screenStart = now
    },
    applyTheme(dark, instant = false) {
      const next = dark ? 1 : 0
      if (next === darkness && !instant) return
      darkness = next
      if (instant) {
        darknessMix = darkness
        lampSwitchedOn = introDuration
      } else if (dark) {
        lampSwitchedOn = now
      }
    },
    dispose() {
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh) && !(object instanceof THREE.Sprite)) return
        if (object instanceof THREE.Mesh) object.geometry.dispose()
        const material = object.material as ThreeModule.MeshBasicMaterial
        material.map?.dispose()
        material.dispose()
      })
    },
  }
}
