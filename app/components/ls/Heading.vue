<script setup lang="ts">
// Section heading used by the landing page sections.
withDefaults(defineProps<{
  eyebrow?: string
  title: string
  description?: string
  align?: 'center' | 'left'
}>(), { align: 'center' })
</script>

<template>
  <div
    class="ls-heading"
    :class="align === 'center' ? 'ls-heading--center' : ''"
  >
    <p
      v-if="eyebrow"
      class="ls-eyebrow"
      data-reveal
    >
      {{ eyebrow }}
    </p>
    <h2
      data-reveal
      style="--d: 80ms"
    >
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="ls-heading__desc"
      data-reveal
      style="--d: 160ms"
    >
      {{ description }}
    </p>
  </div>
</template>

<style scoped>
.ls-heading {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 44rem;
}

.ls-heading--center {
  align-items: center;
  margin-inline: auto;
  text-align: center;
}

h2 {
  margin: 0;
  font-size: clamp(2rem, 4.2vw, 3.25rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.035em;
  color: var(--ui-text-highlighted);
  text-wrap: balance;
}

.ls-heading__desc {
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.65;
  color: var(--ui-text-muted);
  text-wrap: pretty;
}
</style>
