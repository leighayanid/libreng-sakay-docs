<script setup lang="ts">
// Closing call to action: a glowing panel with routes running through it.
withDefaults(defineProps<{
  title?: string
  description?: string
  links?: { label: string, to: string, icon?: string, primary?: boolean }[]
}>(), {
  links: () => [],
})

const root = ref<HTMLElement | null>(null)
useReveal(root)
const { onPointerMove, onPointerLeave } = usePointerVars(root)
</script>

<template>
  <section class="ls-landing ls-cta-wrap">
    <div
      ref="root"
      class="ls-cta ls-grain"
      data-reveal
      @pointermove="onPointerMove"
      @pointerleave="onPointerLeave"
    >
      <div
        class="ls-cta__bg"
        aria-hidden="true"
      >
        <div class="ls-cta__beam" />
        <svg
          viewBox="0 0 1200 420"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            v-for="(d, i) in [
              'M -20 340 C 200 300 300 180 520 200 S 860 330 1220 120',
              'M -20 120 C 240 160 360 60 600 90 S 940 250 1220 230',
              'M 160 440 C 260 300 420 300 560 260 S 900 120 1000 -20',
            ]"
            :key="i"
            :d="d"
            pathLength="1000"
            :style="{ animationDelay: `${i * -4}s` }"
          />
        </svg>
      </div>

      <div class="ls-cta__icon">
        <UIcon name="i-lucide-bus-front" />
      </div>
      <h2>{{ title }}</h2>
      <p v-if="description">
        {{ description }}
      </p>
      <div
        v-if="links.length"
        class="ls-cta__links"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="ls-cta__btn"
          :class="{ 'is-primary': link.primary }"
        >
          {{ link.label }}
          <UIcon
            v-if="link.icon"
            :name="link.icon"
          />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ls-cta-wrap {
  max-width: var(--ui-container);
  margin: 0 auto;
  padding: 3rem 1rem 7rem;
}

@media (min-width: 640px) { .ls-cta-wrap { padding-inline: 1.5rem; } }
@media (min-width: 1024px) { .ls-cta-wrap { padding-inline: 2rem; } }

.ls-cta {
  --mx: 50%;
  --my: 0%;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  padding: clamp(3.5rem, 8vw, 6rem) 1.5rem;
  border-radius: 2rem;
  text-align: center;
  color: #fff;
  background:
    radial-gradient(80% 120% at 50% 0%, #1e40af 0%, transparent 60%),
    radial-gradient(60% 80% at 100% 100%, #047857 0%, transparent 60%),
    #0b1220;
  box-shadow: 0 40px 100px -40px rgb(37 99 235 / 0.6), 0 0 0 1px rgb(255 255 255 / 0.08) inset;
}

.ls-cta__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.ls-cta__bg svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.ls-cta__bg path {
  fill: none;
  stroke: rgb(255 255 255 / 0.2);
  stroke-width: 1.5;
  stroke-dasharray: 3 9;
  animation: ls-dash 40s linear infinite;
}

.ls-cta__beam {
  position: absolute;
  inset: 0;
  background: radial-gradient(500px circle at var(--mx) var(--my), rgb(56 189 248 / 0.25), transparent 60%);
}

.ls-cta__icon {
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #3b82f6, #10b981);
  box-shadow: 0 0 0 6px rgb(255 255 255 / 0.06), 0 16px 40px -10px rgb(59 130 246 / 0.8);
  animation: ls-float 5s ease-in-out infinite;
}

.ls-cta__icon :deep(svg),
.ls-cta__icon > span {
  width: 1.75rem;
  height: 1.75rem;
}

.ls-cta h2 {
  margin: 0.5rem 0 0;
  max-width: 40rem;
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.04em;
  text-wrap: balance;
}

.ls-cta p {
  margin: 0;
  max-width: 34rem;
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgb(226 232 240 / 0.8);
  text-wrap: pretty;
}

.ls-cta__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.85rem;
  margin-top: 1rem;
}

.ls-cta__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 3rem;
  padding: 0 1.35rem;
  border-radius: 0.85rem;
  font-weight: 600;
  color: #fff;
  background: rgb(255 255 255 / 0.08);
  border: 1px solid rgb(255 255 255 / 0.16);
  backdrop-filter: blur(10px);
  transition: transform 0.35s var(--ls-ease), background-color 0.3s;
}

.ls-cta__btn:hover {
  transform: translateY(-2px);
  background: rgb(255 255 255 / 0.14);
}

.ls-cta__btn.is-primary {
  color: #0b1220;
  background: #fff;
  border-color: #fff;
  box-shadow: 0 12px 30px -10px rgb(255 255 255 / 0.5);
}

.ls-cta__btn.is-primary:hover { background: #e2e8f0; }

.ls-cta__btn :deep(svg),
.ls-cta__btn > span {
  width: 1.05rem;
  height: 1.05rem;
}
</style>
