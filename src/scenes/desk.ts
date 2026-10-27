import type * as ThreeModule from 'three'

type Three = typeof ThreeModule

export const deskItemIds = [
  'lolstats',
  'bracketly',
  'kumafy',
  'clase',
  'cv',
  'about',
  'contact',
] as const

export type DeskItemId = (typeof deskItemIds)[number]

export interface DeskItem {
  id: DeskItemId
  object: ThreeModule.Group
  anchor: ThreeModule.Vector3
  baseY: number
}

export interface Desk {
  scene: ThreeModule.Scene
  items: DeskItem[]
  bounds: ThreeModule.Vector3[]
  center: ThreeModule.Vector3
  update: (seconds: number) => void
  applyTheme: (dark: boolean) => void
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

function drawScreen(ctx: CanvasRenderingContext2D) {
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
  ctx.strokeStyle = '#8b5cf6'
  ctx.lineWidth = 4
  ctx.beginPath()
  ;[40, 70, 55, 95, 88, 120, 110, 150, 140, 135, 170].forEach((value, index) => {
    const x = 26 + index * 26
    const y = 250 - value
    if (index === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()
  for (let row = 0; row < 4; row++) {
    ctx.fillStyle = row % 2 ? '#2a2452' : '#3b3470'
    ctx.fillRect(330, 34 + row * 58, 158, 46)
    ctx.fillStyle = row % 3 ? '#4ade80' : '#f87171'
    ctx.fillRect(330, 34 + row * 58, 6, 46)
  }
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

export function buildDesk(THREE: Three): Desk {
  const scene = new THREE.Scene()

  scene.add(new THREE.HemisphereLight(0xf3edff, 0x6d4bb8, 1.4))
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

  function canvasMaterial(canvas: HTMLCanvasElement) {
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
  }

  addBox([9, 0.35, 7], materials.floor, [0, -0.175, 0])
  addBox([9, 0.12, 7], materials.edge, [0, -0.41, 0])
  addBox([9, 4.6, 0.25], materials.wall, [0, 2.3, -3.375])
  addBox([0.25, 4.6, 7], materials.wall, [-4.375, 2.3, 0])

  const rug = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.03, 48), materials.rug)
  rug.position.set(0.6, 0.015, 1.1)
  rug.receiveShadow = true
  scene.add(rug)

  addBox([4.6, 0.16, 1.9], materials.wood, [0, 1.55, -2.2])
  for (const [x, z] of [
    [-2.15, -3.0],
    [2.15, -3.0],
    [-2.15, -1.4],
    [2.15, -1.4],
  ] as const) {
    addBox([0.12, 1.5, 0.12], materials.wood, [x, 0.75, z])
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
  addMesh(
    new THREE.PlaneGeometry(2.16, 1.22),
    canvasMaterial(drawCanvas(512, 300, drawScreen)),
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
  bookMaterials.forEach((material, index) => {
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
  })
  addMesh(new THREE.SphereGeometry(0.22, 32, 16), materials.glass, [0.75, 3.56, 0], shelf)
  shelf.position.set(-2.5, 0, -3.05)
  addItem('clase', shelf, [-2.7, 4.15, -3.05])

  const papers = new THREE.Group()
  for (let index = 0; index < 4; index++) {
    const sheet = addBox(
      [0.62, 0.02, 0.86],
      materials.white,
      [(index % 2) * 0.03, 1.65 + index * 0.022, 0],
      papers,
    )
    sheet.rotation.y = (index - 1.5) * 0.06
  }
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
    const canvas = drawCanvas(256, 256, (ctx) => drawDuotone(ctx, photo))
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    photoMaterial.map = texture
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
  addMesh(new THREE.SphereGeometry(0.07, 16, 10), materials.violet, [0, 0.09, 0.02], envelope)
  envelope.position.set(2.1, 0.02, 1.3)
  envelope.rotation.y = -0.4
  addItem('contact', envelope, [2.1, 0.75, 1.3])

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

  return {
    scene,
    items,
    bounds,
    center: new THREE.Vector3(0, 1.9, 0),
    update(seconds) {
      floaters.forEach(({ sphere, baseY }, index) => {
        sphere.position.y = baseY + Math.sin(seconds * 0.9 + index * 2) * 0.12
      })
      const beat = 1 + Math.max(0, Math.sin(seconds * 7.5)) ** 4 * 0.5
      cones.forEach((cone) => {
        cone.scale.y = 0.4 * beat
      })
    },
    applyTheme(dark) {
      const colors = dark ? darkColors : lightColors
      materials.floor.color.set(colors.floor)
      materials.edge.color.set(colors.edge)
      materials.wall.color.set(colors.wall)
      materials.wood.color.set(colors.wood)
      materials.rug.color.set(colors.rug)
      rim.intensity = dark ? 40 : 18
      sun.intensity = dark ? 1.3 : 2.2
    },
    dispose() {
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        object.geometry.dispose()
        const material = object.material as ThreeModule.MeshBasicMaterial
        material.map?.dispose()
        material.dispose()
      })
    },
  }
}
