<script setup lang="ts">
// "One day on the route": the steps of a day drawn as a transit line.
// The line fills and a bus moves down it as the reader scrolls.
type Part = 'admin' | 'driver' | 'kiosk' | 'server'

withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  description?: string
  steps?: { time: string, part: Part, title: string, text: string, to?: string }[]
}>(), {
  steps: () => [],
})

const parts: Record<Part, { label: string, icon: string }> = {
  admin: { label: 'Admin', icon: 'i-lucide-layout-dashboard' },
  driver: { label: 'Driver app', icon: 'i-lucide-smartphone' },
  kiosk: { label: 'Kiosk', icon: 'i-lucide-nfc' },
  server: { label: 'Server', icon: 'i-lucide-server' },
}

const NuxtLink = resolveComponent('NuxtLink')
const root = ref<HTMLElement | null>(null)
const line = ref<HTMLElement | null>(null)
const progress = ref(0)
const reached = ref(-1)
useReveal(root)

let frame = 0
function update() {
  frame = 0
  const el = line.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const anchor = window.innerHeight * 0.55
  const p = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height))
  progress.value = p
  const stops = el.querySelectorAll<HTMLElement>('[data-stop]')
  let last = -1
  stops.forEach((stop, i) => {
    if (stop.getBoundingClientRect().top + 12 <= anchor) last = i
  })
  reached.value = last
}
function onScroll() {
  if (!frame) frame = requestAnimationFrame(update)
}
onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <section
    ref="root"
    class="ls-landing ls-tl"
  >
    <div class="ls-tl__glow" />
    <div class="ls-tl__inner">
      <LsHeading
        :eyebrow="eyebrow"
        :title="title || ''"
        :description="description"
      />

      <div
        ref="line"
        class="ls-tl__line"
        :style="{ '--p': progress }"
      >
        <div class="ls-tl__track">
          <div class="ls-tl__fill" />
          <div class="ls-tl__bus">
            <UIcon name="i-lucide-bus-front" />
          </div>
        </div>

        <ol class="ls-tl__steps">
          <li
            v-for="(step, i) in steps"
            :key="i"
            class="ls-tl__step"
            :class="[`ls-tl__step--${step.part}`, { 'is-reached': i <= reached }, i % 2 ? 'is-right' : 'is-left']"
          >
            <span
              class="ls-tl__stop"
              data-stop
            >
              <span>{{ i + 1 }}</span>
            </span>
            <component
              :is="step.to ? NuxtLink : 'div'"
              :to="step.to"
              class="ls-tl__card"
              data-reveal
            >
              <div class="ls-tl__meta">
                <span class="ls-tl__time">{{ step.time }}</span>
                <span class="ls-tl__part">
                  <UIcon :name="parts[step.part].icon" />
                  {{ parts[step.part].label }}
                </span>
              </div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
              <span
                v-if="step.to"
                class="ls-tl__more"
              >
                Read more
                <UIcon name="i-lucide-arrow-right" />
              </span>
            </component>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ls-tl {
  position: relative;
  padding: 6rem 0;
  overflow: hidden;
}

.ls-tl__glow {
  position: absolute;
  inset: 10% -20% auto;
  height: 70%;
  background:
    radial-gradient(40% 50% at 20% 40%, color-mix(in oklab, var(--ls-blue) 10%, transparent), transparent 70%),
    radial-gradient(35% 45% at 80% 70%, color-mix(in oklab, var(--ls-green-soft) 9%, transparent), transparent 70%);
  pointer-events: none;
}

.ls-tl__inner {
  position: relative;
  max-width: 68rem;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

@media (min-width: 640px) { .ls-tl__inner { padding: 0 1.5rem; } }

.ls-tl__line {
  --p: 0;
  --rail: 1.25rem;
  position: relative;
}

/* rail */
.ls-tl__track {
  position: absolute;
  top: 0.5rem;
  bottom: 0.5rem;
  left: var(--rail);
  width: 6px;
  margin-left: -3px;
  border-radius: 99px;
  background: var(--ls-line-strong);
}

.ls-tl__fill {
  position: absolute;
  inset: 0 0 auto;
  height: calc(var(--p) * 100%);
  border-radius: inherit;
  background: linear-gradient(180deg, var(--ls-blue), var(--ls-sky) 50%, var(--ls-green-soft));
  box-shadow: 0 0 20px color-mix(in oklab, var(--ls-sky) 60%, transparent);
}

.ls-tl__bus {
  position: absolute;
  left: 50%;
  top: calc(var(--p) * 100%);
  z-index: 3;
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  transform: translate(-50%, -50%);
  border-radius: 0.8rem;
  color: #fff;
  background: linear-gradient(135deg, var(--ls-blue), var(--ls-sky));
  box-shadow: 0 0 0 4px var(--ui-bg), 0 10px 30px -6px color-mix(in oklab, var(--ls-blue) 80%, transparent);
}

.ls-tl__bus :deep(svg),
.ls-tl__bus > span {
  width: 1.3rem;
  height: 1.3rem;
}

/* steps */
.ls-tl__steps {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ls-tl__step {
  --c: var(--ls-blue);
  position: relative;
  padding-left: calc(var(--rail) * 2 + 1rem);
}

.ls-tl__step--driver { --c: var(--ls-sky); }
.ls-tl__step--kiosk { --c: var(--ls-green-soft); }
.ls-tl__step--server { --c: var(--ls-amber); }

.ls-tl__stop {
  position: absolute;
  left: var(--rail);
  top: 1.6rem;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 1.9rem;
  height: 1.9rem;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--ui-text-muted);
  background: var(--ui-bg);
  border: 3px solid var(--ls-line-strong);
  transition: border-color 0.5s, color 0.5s, box-shadow 0.5s, transform 0.5s var(--ls-ease);
}

.is-reached .ls-tl__stop {
  color: var(--ui-text-highlighted);
  border-color: var(--c);
  box-shadow: 0 0 0 6px color-mix(in oklab, var(--c) 18%, transparent), 0 0 24px color-mix(in oklab, var(--c) 60%, transparent);
  transform: translate(-50%, -50%) scale(1.08);
}

.ls-tl__card {
  position: relative;
  display: block;
  padding: 1.35rem 1.5rem;
  border-radius: 1.25rem;
  background: var(--ls-card);
  border: 1px solid var(--ls-line);
  box-shadow: var(--ls-shadow);
  transition: transform 0.45s var(--ls-ease), border-color 0.4s, box-shadow 0.45s var(--ls-ease);
}

.ls-tl__card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 1.2rem;
  bottom: 1.2rem;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: var(--c);
  opacity: 0.25;
  transition: opacity 0.5s;
}

.is-reached .ls-tl__card::before { opacity: 1; }

a.ls-tl__card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in oklab, var(--c) 45%, transparent);
  box-shadow: 0 24px 50px -24px color-mix(in oklab, var(--c) 55%, transparent), var(--ls-shadow);
}

.ls-tl__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
}

.ls-tl__time {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--ui-text-highlighted);
  padding: 0.15rem 0.5rem;
  border-radius: 0.4rem;
  background: var(--ls-line);
}

.ls-tl__part {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c);
}

.ls-tl__part :deep(svg),
.ls-tl__part > span {
  width: 0.9rem;
  height: 0.9rem;
}

.ls-tl__card h3 {
  margin: 0 0 0.35rem;
  font-size: 1.2rem;
  font-weight: 650;
  letter-spacing: -0.02em;
  color: var(--ui-text-highlighted);
}

.ls-tl__card p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--ui-text-muted);
}

.ls-tl__more {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.8rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c);
}

.ls-tl__more :deep(svg),
.ls-tl__more > span {
  width: 0.9rem;
  height: 0.9rem;
  transition: transform 0.3s var(--ls-ease);
}

a.ls-tl__card:hover .ls-tl__more :deep(svg),
a.ls-tl__card:hover .ls-tl__more > span { transform: translateX(3px); }

/* desktop: rail in the middle, cards alternate sides */
@media (min-width: 900px) {
  .ls-tl__line { --rail: 50%; }
  .ls-tl__steps { gap: 0; }
  .ls-tl__step {
    width: 50%;
    padding-left: 0;
  }
  .ls-tl__step + .ls-tl__step { margin-top: -2.5rem; }
  .ls-tl__step.is-left { padding-right: 3.5rem; }
  .ls-tl__step.is-right {
    margin-left: 50%;
    padding-left: 3.5rem;
  }
  .ls-tl__step.is-left .ls-tl__stop { left: 100%; }
  .ls-tl__step.is-right .ls-tl__stop { left: 0; }
  .ls-tl__step.is-left .ls-tl__card::before {
    left: auto;
    right: 0;
    border-radius: 3px 0 0 3px;
  }
  .ls-tl__step.is-left .ls-tl__card { text-align: right; }
  .ls-tl__step.is-left .ls-tl__meta { justify-content: flex-end; }
}
</style>
