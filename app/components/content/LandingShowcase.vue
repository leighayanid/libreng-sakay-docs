<script setup lang="ts">
// The admin live map in a browser frame, with buses moving on it, plus a row of key numbers.
const props = withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  description?: string
  image?: string
  url?: string
  stats?: { value: number, suffix?: string, label: string }[]
  callouts?: { icon: string, title: string, text: string }[]
}>(), {
  image: '/images/admin/13-live-map.webp',
  url: 'libresakay / admin / live-monitoring',
  stats: () => [],
  callouts: () => [],
})

const root = ref<HTMLElement | null>(null)
const frame = ref<HTMLElement | null>(null)
const statsEl = ref<HTMLElement | null>(null)
useReveal(root)
const uid = useId()
const id = (name: string) => `${uid}-${name}`

// Positions are in the screenshot's own pixels (1400 x 788).
const routes = [
  { d: 'M 1015 292 C 1020 330 1030 360 1028 389 S 1045 415 1057 423 S 1100 500 1113 532 S 1140 640 1150 675', dur: 11 },
  { d: 'M 668 592 C 720 560 770 520 816 506 S 900 480 960 450 S 1010 400 1028 389', dur: 9 },
]
const stops = [[1015, 292], [1028, 389], [1057, 423], [1113, 532], [1150, 675], [668, 592], [816, 506]]

// Tilt the frame back while it scrolls in, flat once it's centred.
const tilt = ref(1)
let raf = 0
function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    const el = frame.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const start = window.innerHeight
    const end = window.innerHeight * 0.35
    tilt.value = Math.min(1, Math.max(0, (rect.top - end) / (start - end)))
  })
}

// Count the numbers up once they're visible.
const shown = ref(props.stats.map(() => 0))
let statsObserver: IntersectionObserver | undefined
function countUp() {
  const t0 = performance.now()
  const dur = 1600
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / dur)
    const eased = 1 - (1 - k) ** 4
    shown.value = props.stats.map(s => Math.round(s.value * eased))
    if (k < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    shown.value = props.stats.map(s => s.value)
    tilt.value = 0
    return
  }
  statsObserver = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) {
      countUp()
      statsObserver?.disconnect()
    }
  }, { threshold: 0.4 })
  if (statsEl.value) statsObserver.observe(statsEl.value)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('scroll', onScroll)
  statsObserver?.disconnect()
})
</script>

<template>
  <section
    ref="root"
    class="ls-landing ls-show"
  >
    <div class="ls-show__inner">
      <LsHeading
        :eyebrow="eyebrow"
        :title="title || ''"
        :description="description"
      />

      <div class="ls-show__stage">
        <div
          ref="frame"
          class="ls-browser"
          :style="{ '--tilt': tilt }"
        >
          <div class="ls-browser__bar">
            <span class="ls-browser__dots"><i /><i /><i /></span>
            <span class="ls-browser__url">
              <UIcon name="i-lucide-lock" />
              {{ url }}
            </span>
            <span class="ls-browser__live"><span class="ls-dot" /> Live</span>
          </div>
          <div class="ls-browser__view">
            <img
              :src="image"
              alt="Admin live monitoring map of Bataan"
              loading="lazy"
            >
            <svg
              class="ls-browser__overlay"
              viewBox="0 0 1400 788"
              aria-hidden="true"
            >
              <defs>
                <filter
                  :id="id('glow')"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="5" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g
                v-for="(route, i) in routes"
                :key="i"
              >
                <path
                  :id="id(`m${i}`)"
                  :d="route.d"
                  class="ls-map__route"
                />
                <path
                  :d="route.d"
                  class="ls-map__route-hi"
                  pathLength="1000"
                />
              </g>
              <g
                v-for="([x, y], i) in stops"
                :key="`s${i}`"
              >
                <circle
                  :cx="x"
                  :cy="y"
                  r="16"
                  class="ls-map__ping"
                  :style="{ animationDelay: `${i * 0.4}s` }"
                />
                <circle
                  :cx="x"
                  :cy="y"
                  r="7"
                  class="ls-map__stop"
                />
              </g>
              <g
                v-for="(route, i) in routes"
                :key="`b${i}`"
                :filter="`url(#${id('glow')})`"
              >
                <g>
                  <animateMotion
                    :dur="`${route.dur}s`"
                    repeatCount="indefinite"
                    :keyPoints="i ? '0;1;0' : '0;1;0'"
                    keyTimes="0;0.5;1"
                    calcMode="linear"
                  >
                    <mpath :href="`#${id(`m${i}`)}`" />
                  </animateMotion>
                  <circle
                    r="15"
                    class="ls-map__bus"
                  />
                  <path
                    d="M -6 -5 h 12 v 9 h -12 z M -6 -1 h 12"
                    class="ls-map__bus-icon"
                  />
                </g>
              </g>
            </svg>
          </div>
        </div>

        <div
          v-for="(callout, i) in callouts"
          :key="callout.title"
          class="ls-callout"
          :class="`ls-callout--${i}`"
        >
          <span class="ls-callout__icon"><UIcon :name="callout.icon" /></span>
          <div>
            <strong>{{ callout.title }}</strong>
            <span>{{ callout.text }}</span>
          </div>
        </div>
      </div>

      <dl
        v-if="stats.length"
        ref="statsEl"
        class="ls-stats"
      >
        <div
          v-for="(stat, i) in stats"
          :key="stat.label"
          class="ls-stat"
          data-reveal
          :style="{ '--d': `${i * 90}ms` }"
        >
          <dt>{{ stat.label }}</dt>
          <dd>
            <span class="ls-gradient-text">{{ shown[i] }}</span><small v-if="stat.suffix">{{ stat.suffix }}</small>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.ls-show {
  position: relative;
  padding: 6rem 0;
}

.ls-show__inner {
  max-width: var(--ui-container);
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

@media (min-width: 640px) { .ls-show__inner { padding: 0 1.5rem; } }
@media (min-width: 1024px) { .ls-show__inner { padding: 0 2rem; } }

.ls-show__stage {
  position: relative;
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  perspective: 2000px;
}

.ls-show__stage::before {
  content: "";
  position: absolute;
  inset: 10% 5% -6%;
  border-radius: 50%;
  background: radial-gradient(closest-side, color-mix(in oklab, var(--ls-blue) 35%, transparent), transparent);
  filter: blur(50px);
  opacity: 0.6;
}

.ls-browser {
  --tilt: 1;
  position: relative;
  border-radius: 1.25rem;
  overflow: hidden;
  background: var(--ui-bg);
  border: 1px solid var(--ls-line-strong);
  box-shadow:
    0 1px 0 rgb(255 255 255 / 0.08) inset,
    0 60px 120px -40px rgb(2 6 23 / 0.55),
    0 30px 60px -30px rgb(2 6 23 / 0.4);
  transform-origin: 50% 100%;
  transform: rotateX(calc(var(--tilt) * 22deg)) scale(calc(1 - var(--tilt) * 0.06)) translateY(calc(var(--tilt) * 30px));
  will-change: transform;
}

.ls-browser__bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.7rem 1rem;
  background: var(--ls-card);
  border-bottom: 1px solid var(--ls-line);
}

.ls-browser__dots {
  display: flex;
  gap: 0.4rem;
}

.ls-browser__dots i {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: #f87171;
}

.ls-browser__dots i:nth-child(2) { background: #fbbf24; }
.ls-browser__dots i:nth-child(3) { background: #34d399; }

.ls-browser__url {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  max-width: 26rem;
  margin: 0 auto;
  padding: 0.3rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: var(--ui-text-muted);
  background: var(--ls-line);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ls-browser__url :deep(svg),
.ls-browser__url > span {
  width: 0.75rem;
  height: 0.75rem;
  flex-shrink: 0;
}

.ls-browser__live {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--ls-green-soft);
}

.ls-dot {
  position: relative;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: currentColor;
}

.ls-dot::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: inherit;
  animation: ls-ping 2s var(--ls-ease) infinite;
}

.ls-browser__view {
  position: relative;
  aspect-ratio: 1400 / 788;
}

.ls-browser__view img {
  display: block;
  width: 100%;
  height: 100%;
}

.ls-browser__overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.ls-map__route {
  fill: none;
  stroke: #2563eb;
  stroke-opacity: 0.35;
  stroke-width: 10;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ls-map__route-hi {
  fill: none;
  stroke: #2563eb;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 8 14;
  animation: ls-dash 40s linear infinite;
}

.ls-map__stop {
  fill: #fff;
  stroke: #2563eb;
  stroke-width: 4;
}

.ls-map__ping {
  fill: #2563eb;
  transform-box: fill-box;
  transform-origin: center;
  animation: ls-ping 3s var(--ls-ease) infinite;
}

.ls-map__bus {
  fill: #059669;
  stroke: #fff;
  stroke-width: 4;
}

.ls-map__bus-icon {
  fill: none;
  stroke: #fff;
  stroke-width: 2;
  stroke-linejoin: round;
}

/* callouts */
.ls-callout {
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 17rem;
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  background: var(--ls-glass);
  border: 1px solid var(--ls-glass-border);
  backdrop-filter: blur(16px) saturate(1.4);
  box-shadow: var(--ls-shadow);
  animation: ls-float 7s ease-in-out infinite;
}

.ls-callout__icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 0.7rem;
  color: #fff;
  background: linear-gradient(135deg, var(--ls-blue), var(--ls-sky));
}

.ls-callout--1 .ls-callout__icon { background: linear-gradient(135deg, var(--ls-rose), var(--ls-amber)); }
.ls-callout--2 .ls-callout__icon { background: linear-gradient(135deg, var(--ls-green), var(--ls-green-soft)); }

.ls-callout__icon :deep(svg),
.ls-callout__icon > span {
  width: 1.15rem;
  height: 1.15rem;
}

.ls-callout strong {
  display: block;
  font-size: 0.85rem;
  color: var(--ui-text-highlighted);
}

.ls-callout div > span {
  display: block;
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--ui-text-muted);
}

.ls-callout--0 { left: -3%; top: 24%; }
.ls-callout--1 { right: -3%; top: 12%; animation-delay: -2.5s; }
.ls-callout--2 { right: 6%; bottom: -5%; animation-delay: -5s; }

@media (max-width: 899px) {
  .ls-callout { display: none; }
}

/* stats */
.ls-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin: 0 auto;
  width: 100%;
  max-width: 64rem;
  border-radius: 1.5rem;
  overflow: hidden;
  background: var(--ls-line);
  border: 1px solid var(--ls-line);
}

@media (min-width: 768px) {
  .ls-stats { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

.ls-stat {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.35rem;
  padding: 1.75rem 1.5rem;
  background: var(--ui-bg);
}

.ls-stat dd {
  margin: 0;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
  font-variant-numeric: tabular-nums;
}

.ls-stat small {
  margin-left: 0.15rem;
  font-size: 0.45em;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ui-text-muted);
}

.ls-stat dt {
  font-size: 0.9rem;
  line-height: 1.45;
  color: var(--ui-text-muted);
}
</style>
