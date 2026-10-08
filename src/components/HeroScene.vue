<script setup lang="ts">
import { ref } from 'vue'
import { useGlassScene } from '@/composables/useGlassScene'

// Escena 3D del hero: una esfera de cristal con tres más pequeñas en órbita

const emit = defineEmits<{ ready: []; failed: [] }>()
const canvas = ref<HTMLCanvasElement | null>(null)

useGlassScene({
  canvas,
  background: true,
  // Las esferas en órbita llegan hasta unas 2,5 unidades del centro (+ margen)
  minHalfWidth: 2.9,
  onReady: () => emit('ready'),
  onFail: () => emit('failed'),
  build(THREE, material) {
    const figure = new THREE.Group()
    const geometries = [
      new THREE.SphereGeometry(1, 48, 32),
      new THREE.SphereGeometry(0.45, 32, 16),
      new THREE.SphereGeometry(0.33, 32, 16),
      new THREE.SphereGeometry(0.24, 32, 16),
    ]
    const [centerGeometry, ...moonGeometries] = geometries
    figure.add(new THREE.Mesh(centerGeometry, material))
    const moons = moonGeometries.map((geometry) => {
      const moon = new THREE.Mesh(geometry, material)
      figure.add(moon)
      return moon
    })

    return {
      object: figure,
      update(seconds) {
        moons.forEach((moon, i) => {
          const angle = seconds * (0.5 + i * 0.2) + i * 2.1
          const radius = 1.6 + i * 0.2
          moon.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.3) * 0.6, Math.sin(angle) * radius)
        })
      },
      dispose: () => geometries.forEach((geometry) => geometry.dispose()),
    }
  },
})
</script>

<template>
  <canvas ref="canvas" class="block" aria-hidden="true"></canvas>
</template>
