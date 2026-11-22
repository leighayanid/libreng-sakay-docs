<script setup lang="ts">
// Replaces the default code block so ```mermaid fences are drawn as diagrams (see Mermaid.vue).
// Every other language falls through to Nuxt UI's code block unchanged.
// The fence's meta text becomes the caption: ```mermaid One bus, one day
import UProsePre from '@nuxt/ui/components/prose/Pre.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  code?: string
  language?: string
  filename?: string
  meta?: string
}>()

const caption = computed(() => props.filename || props.meta?.trim() || undefined)
</script>

<template>
  <Mermaid
    v-if="language === 'mermaid' && code"
    :code="code"
    :caption="caption"
  />
  <UProsePre
    v-else
    v-bind="{ ...$attrs, ...props }"
  >
    <slot />
  </UProsePre>
</template>
