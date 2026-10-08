<script setup lang="ts">
import { ref } from 'vue'
import { useGlassScene } from '@/composables/useGlassScene'

// Escena 3D de Contacto: dos esferas que giran una alrededor de la otra y dos
// pequeñas que van de una a otra, como mensajes. El fondo es transparente.

const emit = defineEmits<{ ready: []; failed: [] }>()
const canvas = ref<HTMLCanvasElement | null>(null)

useGlassScene({
  canvas,
  // El canvas es más alto que la imagen (ver ContactSection.vue); con la cámara más
  // lejos la figura mantiene su tamaño y cabe entera al pasar por delante
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
    // Inclinado para que el giro se vea en perspectiva y no de lado
    group.rotation.x = 0.6

    const orbitRadius = 2.2

    return {
      object: group,
      update(seconds) {
        // Las dos esferas giran alrededor del centro, siempre una frente a la otra
        const angle = seconds * 0.35
        sphereA.position.set(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius)
        sphereB.position.copy(sphereA.position).multiplyScalar(-1)

        // Cada mensaje va de A a B y vuelve; el segundo, desfasado medio viaje.
        // El seno da un ida y vuelta suave: más lento en los extremos
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
  <canvas ref="canvas" class="block" aria-hidden="true"></canvas>
</template>
