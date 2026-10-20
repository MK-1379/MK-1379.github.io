<script setup lang="ts">
import { ref } from 'vue'
import { useGlassScene } from '@/composables/useGlassScene'


const emit = defineEmits<{ ready: []; failed: [] }>()
const canvas = ref<HTMLCanvasElement | null>(null)

useGlassScene({
  canvas,
  cameraDistance: 13.5,
  onReady: () => emit('ready'),
  onFail: () => emit('failed'),
  build(THREE, material) {
    const group = new THREE.Group()
    const geometries = [
      new THREE.SphereGeometry(1.3, 48, 32),
      new THREE.SphereGeometry(1.1, 48, 32),
      new THREE.SphereGeometry(0.3, 24, 12),
    ]
    const [bigGeometry, mediumGeometry, messageGeometry] = geometries
    const sphereA = new THREE.Mesh(bigGeometry, material)
    const sphereB = new THREE.Mesh(mediumGeometry, material)
    const messages = [new THREE.Mesh(messageGeometry, material), new THREE.Mesh(messageGeometry, material)]
    group.add(sphereA, sphereB, ...messages)
    group.rotation.x = 0.6

    const orbitRadius = 2.2

    return {
      object: group,
      update(seconds) {
        const angle = seconds * 0.35
        sphereA.position.set(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius)
        sphereB.position.copy(sphereA.position).multiplyScalar(-1)

        messages.forEach((message, i) => {
          const progress = (Math.sin(seconds * 0.8 + i * Math.PI) + 1) / 2
          message.position.lerpVectors(sphereA.position, sphereB.position, progress)
          message.position.y = Math.sin(progress * Math.PI) * 0.9 * (i === 0 ? 1 : -1)
        })
      },
      dispose: () => geometries.forEach((geometry) => geometry.dispose()),
    }
  },
})
</script>

<template>
  <canvas ref="canvas" class="block max-md:hidden" aria-hidden="true"></canvas>
</template>
