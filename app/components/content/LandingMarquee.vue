<script setup lang="ts">
// An endless, slowly scrolling row of the tools the system is built with.
withDefaults(defineProps<{
  label?: string
  items?: { label: string, icon: string }[]
}>(), {
  items: () => [],
})
</script>

<template>
  <section class="ls-landing ls-marquee">
    <p
      v-if="label"
      class="ls-marquee__label"
    >
      {{ label }}
    </p>
    <div class="ls-marquee__track">
      <ul
        v-for="copy in 2"
        :key="copy"
        class="ls-marquee__row"
        :aria-hidden="copy === 2 ? 'true' : undefined"
      >
        <li
          v-for="item in items"
          :key="item.label"
        >
          <UIcon :name="item.icon" />
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.ls-marquee {
  position: relative;
  padding: 1rem 0 2.5rem;
}

.ls-marquee__label {
  margin: 0 0 1.5rem;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ui-text-dimmed);
}

.ls-marquee__track {
  display: flex;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}

.ls-marquee__row {
  display: flex;
  flex-shrink: 0;
  gap: 3.5rem;
  margin: 0;
  padding: 0 1.75rem;
  list-style: none;
  animation: ls-marquee 38s linear infinite;
}

.ls-marquee__track:hover .ls-marquee__row {
  animation-play-state: paused;
}

.ls-marquee__row li {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  white-space: nowrap;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--ui-text-muted);
  opacity: 0.75;
  transition: opacity 0.3s, color 0.3s;
}

.ls-marquee__row li:hover {
  opacity: 1;
  color: var(--ui-text-highlighted);
}

.ls-marquee__row li :deep(svg),
.ls-marquee__row li > span:first-child {
  width: 1.5rem;
  height: 1.5rem;
}

@keyframes ls-marquee {
  to { transform: translateX(-100%); }
}
</style>
