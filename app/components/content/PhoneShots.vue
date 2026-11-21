<script setup lang="ts">
// Shows phone screenshots side by side, each with a short caption.
// Usage in Markdown:
//   :phone-shots{:shots='[{"src":"/images/kiosk/06-tap-ok.webp","caption":"Welcome aboard"}]'}
defineProps<{
  shots: { src: string, caption: string }[]
}>()
</script>

<template>
  <div class="my-6 flex flex-wrap gap-4">
    <figure
      v-for="shot in shots"
      :key="shot.src"
      class="w-[180px] shrink-0"
    >
      <img
        :src="shot.src"
        :alt="shot.caption"
        loading="lazy"
        class="w-full rounded-xl border border-default"
      >
      <figcaption class="mt-2 text-center text-sm text-muted">
        {{ shot.caption }}
      </figcaption>
    </figure>
  </div>
</template>
