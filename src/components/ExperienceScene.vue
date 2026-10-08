<script setup lang="ts">
import { ref } from 'vue'
import { useGlassScene } from '@/composables/useGlassScene'

// Escena 3D de Experiencia: esferas de cristal en diagonal, de menor a mayor, como los
// pasos de una trayectoria. Cada una flota a su ritmo. El fondo es transparente para
// que se vea la página detrás.

const emit = defineEmits<{ ready: []; failed: [] }>()
const canvas = ref<HTMLCanvasElement | null>(null)

// Posición (x, y, z) y tamaño de cada esfera, de la más pequeña a la más grande
const steps = [
  { x: -2.45, y: -2.2, z: 0.5, size: 0.4 },
  { x: -1.3, y: -1.15, z: -0.25, size: 0.6 },
  { x: 0.15, y: -0.05, z: 0.4, size: 0.85 },
  { x: 1.75, y: 1.35, z: -0.4, size: 1.25 },
]

useGlassScene({
  canvas,
  onReady: () => emit('ready'),
  onFail: () => emit('failed'),
  build(THREE, material) {
    const group = new THREE.Group()
    const spheres = steps.map((step) => {
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(step.size, 40, 24), material)
      sphere.position.set(step.x, step.y, step.z)
      group.add(sphere)
      return sphere
    })

    return {
      object: group,
      update(seconds) {
        // Cada esfera sube y baja con un desfase distinto; el grupo se balancea despacio
        spheres.forEach((sphere, i) => {
          const step = steps[i]!
          sphere.position.y = step.y + Math.sin(seconds * 0.9 + i * 1.3) * 0.15
        })
        group.rotation.y = Math.sin(seconds * 0.3) * 0.35
      },
      dispose: () => spheres.forEach((sphere) => sphere.geometry.dispose()),
    }
  },
})
</script>

<template>
  <canvas ref="canvas" class="block" aria-hidden="true"></canvas>
</template>
