<script setup lang="ts">
import { computed } from 'vue'
import { techIcons } from '@/data/techIcons'

const props = defineProps<{ name: string }>()
const icon = computed(() => techIcons[props.name])
</script>

<template>
  <template v-if="icon">
    <img
      :src="`/img/skills/${icon.icon}.svg`"
      alt=""
      width="14"
      height="14"
      loading="lazy"
      class="size-3.5 shrink-0"
      :class="{ 'dark:hidden': icon.iconDark }"
    />
    <img
      v-if="icon.iconDark"
      :src="`/img/skills/${icon.iconDark}.svg`"
      alt=""
      width="14"
      height="14"
      loading="lazy"
      class="hidden size-3.5 shrink-0 dark:block"
    />
  </template>
</template>
