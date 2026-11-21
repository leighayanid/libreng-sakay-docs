<script setup lang="ts">
// Landing page hero: animated route-map background, headline, and a phone mock-up
// of a passenger tapping in.
withDefaults(defineProps<{
  badge?: string
  badgeTo?: string
  highlight?: string
  title?: string
  description?: string
  links?: { label: string, to: string, icon?: string, primary?: boolean }[]
  pieces?: { label: string, icon: string }[]
}>(), {
  links: () => [],
  pieces: () => [],
})

const root = ref<HTMLElement | null>(null)
const { onPointerMove, onPointerLeave } = usePointerVars(root)
const uid = useId()
const id = (name: string) => `${uid}-${name}`

// Bus routes drawn across the background. Stops sit on the curve end points.
const routes = [
  { d: 'M -60 760 C 180 700 260 540 420 520 S 700 580 860 450 S 1120 250 1520 280', dur: 16, color: 'blue' },
  { d: 'M -60 230 C 160 290 300 170 520 200 S 820 340 1000 300 S 1260 110 1520 150', dur: 19, color: 'sky' },
  { d: 'M 260 980 C 330 780 520 720 640 660 S 880 620 1010 720 S 1240 900 1520 840', dur: 14, color: 'green' },
  { d: 'M 1200 -60 C 1160 140 1260 300 1190 470 S 1100 720 1170 980', dur: 12, color: 'blue' },
]
const stops = [
  [420, 520], [860, 450], [520, 200], [1000, 300], [640, 660], [1010, 720], [1190, 470],
]
</script>

<template>
  <section
    ref="root"
    class="ls-landing ls-hero ls-grain"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <!-- Background -->
    <div
      class="ls-hero__bg"
      aria-hidden="true"
    >
      <div class="ls-hero__aurora ls-hero__aurora--a" />
      <div class="ls-hero__aurora ls-hero__aurora--b" />
      <div class="ls-hero__aurora ls-hero__aurora--c" />
      <div class="ls-hero__grid" />
      <div class="ls-hero__spot" />

      <svg
        class="ls-hero__routes"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient
            :id="id('comet')"
            x1="0"
            x2="1"
          >
            <stop
              offset="0"
              stop-color="var(--ls-sky)"
              stop-opacity="0"
            />
            <stop
              offset="1"
              stop-color="var(--ls-sky)"
            />
          </linearGradient>
          <filter
            :id="id('glow')"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              stdDeviation="4"
              result="b"
            />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          v-for="(route, i) in routes"
          :key="i"
          :class="`ls-route ls-route--${route.color}`"
        >
          <path
            :id="id(`r${i}`)"
            :d="route.d"
            class="ls-route__base"
          />
          <path
            :d="route.d"
            class="ls-route__flow"
            pathLength="1000"
            :style="{ animationDuration: `${route.dur * 2}s` }"
          />
          <path
            :d="route.d"
            class="ls-route__comet"
            pathLength="1000"
            :filter="`url(#${id('glow')})`"
            :style="{ animationDuration: `${route.dur}s`, animationDelay: `${-i * 3}s` }"
          />
          <g :filter="`url(#${id('glow')})`">
            <circle
              r="5"
              class="ls-route__bus"
            >
              <animateMotion
                :dur="`${route.dur}s`"
                :begin="`${-i * 3}s`"
                repeatCount="indefinite"
                rotate="auto"
              >
                <mpath :href="`#${id(`r${i}`)}`" />
              </animateMotion>
            </circle>
          </g>
        </g>

        <g
          v-for="([x, y], i) in stops"
          :key="`s${i}`"
          class="ls-stop"
          :style="{ animationDelay: `${i * 0.45}s` }"
        >
          <circle
            :cx="x"
            :cy="y"
            r="14"
            class="ls-stop__ring"
            :style="{ animationDelay: `${i * 0.45}s` }"
          />
          <circle
            :cx="x"
            :cy="y"
            r="6"
            class="ls-stop__dot"
          />
        </g>
      </svg>
      <div class="ls-hero__veil" />
      <div class="ls-hero__fade" />
    </div>

    <!-- Content -->
    <div class="ls-hero__inner">
      <div class="ls-hero__copy">
        <NuxtLink
          v-if="badge"
          :to="badgeTo || '/'"
          class="ls-badge ls-in"
          style="--i: 0"
        >
          <span class="ls-badge__live"><span /></span>
          {{ badge }}
          <UIcon
            name="i-lucide-arrow-right"
            class="ls-badge__arrow"
          />
        </NuxtLink>

        <h1
          class="ls-hero__title ls-in"
          style="--i: 1"
        >
          <span
            v-if="highlight"
            class="ls-gradient-text"
          >{{ highlight }}</span>
          <span class="ls-hero__title-rest">{{ title }}</span>
        </h1>

        <p
          v-if="description"
          class="ls-hero__desc ls-in"
          style="--i: 2"
        >
          {{ description }}
        </p>

        <div
          v-if="links.length"
          class="ls-hero__links ls-in"
          style="--i: 3"
        >
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="ls-btn"
            :class="link.primary ? 'ls-btn--primary' : 'ls-btn--ghost'"
          >
            {{ link.label }}
            <UIcon
              v-if="link.icon"
              :name="link.icon"
              class="ls-btn__icon"
            />
          </NuxtLink>
        </div>

        <ul
          v-if="pieces.length"
          class="ls-hero__pieces ls-in"
          style="--i: 4"
        >
          <li
            v-for="piece in pieces"
            :key="piece.label"
          >
            <UIcon :name="piece.icon" />
            {{ piece.label }}
          </li>
        </ul>
      </div>

      <!-- Devices -->
      <div
        class="ls-stage ls-in"
        style="--i: 2"
        aria-hidden="true"
      >
        <div class="ls-stage__tilt">
          <div class="ls-stage__halo" />

          <LsPhone
            class="ls-stage__phone ls-stage__phone--back"
            src="/images/driver/05-on-the-road.webp"
            alt="Driver app on the road"
            eager
          />
          <LsPhone
            class="ls-stage__phone ls-stage__phone--front"
            src="/images/kiosk/06-tap-ok.webp"
            alt="Kiosk showing Welcome aboard"
            eager
          />

          <!-- NFC waves where the card meets the phone -->
          <div class="ls-tap">
            <span />
            <span />
            <span />
          </div>

          <!-- Bataeño Pass card -->
          <div class="ls-card-pass">
            <div class="ls-card-pass__top">
              <span class="ls-card-pass__chip" />
              <UIcon
                name="i-lucide-nfc"
                class="ls-card-pass__nfc"
              />
            </div>
            <div class="ls-card-pass__name">
              BATAEÑO PASS
            </div>
            <div class="ls-card-pass__num">
              •••• 2026
            </div>
          </div>

          <!-- Floating glass cards -->
          <div class="ls-float ls-float--trip">
            <div class="ls-float__row">
              <span class="ls-float__icon ls-float__icon--blue">
                <UIcon name="i-lucide-bus-front" />
              </span>
              <div>
                <div class="ls-float__title">
                  BS-001 · Abucay → Capitol
                </div>
                <div class="ls-float__meta">
                  <span class="ls-live-dot" /> On route · GPS every 5 s
                </div>
              </div>
            </div>
            <div class="ls-float__progress">
              <span />
            </div>
          </div>

          <div class="ls-float ls-float--toast">
            <span class="ls-float__icon ls-float__icon--green">
              <UIcon name="i-lucide-check" />
            </span>
            <div>
              <div class="ls-float__title">
                Welcome aboard
              </div>
              <div class="ls-float__meta">
                Tap saved · syncing
              </div>
            </div>
            <span class="ls-float__plus">+1</span>
          </div>

          <div class="ls-float ls-float--chart">
            <div class="ls-float__meta">
              Boardings today
            </div>
            <div class="ls-float__big">
              1,284
            </div>
            <svg
              viewBox="0 0 160 44"
              class="ls-spark"
            >
              <defs>
                <linearGradient
                  :id="id('spark')"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop
                    offset="0"
                    stop-color="var(--ls-green-soft)"
                    stop-opacity=".45"
                  />
                  <stop
                    offset="1"
                    stop-color="var(--ls-green-soft)"
                    stop-opacity="0"
                  />
                </linearGradient>
              </defs>
              <path
                d="M0 38 C 14 36 18 28 30 30 S 48 18 60 22 S 80 30 92 18 S 116 6 128 12 S 148 4 160 2 L160 44 L0 44 Z"
                :fill="`url(#${id('spark')})`"
                class="ls-spark__area"
              />
              <path
                d="M0 38 C 14 36 18 28 30 30 S 48 18 60 22 S 80 30 92 18 S 116 6 128 12 S 148 4 160 2"
                class="ls-spark__line"
                pathLength="1"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <a
      href="#ls-flow"
      class="ls-hero__scroll"
      aria-label="Scroll to the next section"
    >
      <span />
    </a>
  </section>
</template>

<style scoped>
.ls-hero {
  --px: 0;
  --py: 0;
  --mx: 70%;
  --my: 30%;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: min(920px, calc(100svh - var(--ui-header-height)));
  display: flex;
  align-items: center;
  padding: 4.5rem 0 6rem;
}

/* ---------- background ---------- */
.ls-hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.ls-hero__aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.55;
  animation: ls-aurora 22s ease-in-out infinite alternate;
}

.ls-hero__aurora--a {
  width: 46rem;
  height: 32rem;
  top: -14rem;
  left: -10rem;
  background: radial-gradient(closest-side, var(--ls-blue), transparent);
}

.ls-hero__aurora--b {
  width: 40rem;
  height: 30rem;
  top: 10%;
  right: -12rem;
  background: radial-gradient(closest-side, var(--ls-green-soft), transparent);
  opacity: 0.35;
  animation-delay: -7s;
  animation-duration: 26s;
}

.ls-hero__aurora--c {
  width: 36rem;
  height: 26rem;
  bottom: -14rem;
  left: 30%;
  background: radial-gradient(closest-side, var(--ls-sky), transparent);
  opacity: 0.3;
  animation-delay: -14s;
}

@keyframes ls-aurora {
  0% { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
  50% { transform: translate3d(6rem, 3rem, 0) scale(1.15) rotate(12deg); }
  100% { transform: translate3d(-4rem, 5rem, 0) scale(0.95) rotate(-8deg); }
}

.ls-hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--ls-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--ls-line) 1px, transparent 1px);
  background-size: 64px 64px;
  background-position: center top;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 75%);
}

.ls-hero__spot {
  position: absolute;
  inset: 0;
  background: radial-gradient(600px circle at var(--mx) var(--my), color-mix(in oklab, var(--ls-blue) 14%, transparent), transparent 60%);
  transition: background 0.2s;
}

.ls-hero__routes {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  mask-image: linear-gradient(180deg, #000 55%, transparent 100%);
}

.ls-route { --c: var(--ls-blue); }
.ls-route--sky { --c: var(--ls-sky); }
.ls-route--green { --c: var(--ls-green-soft); }

.ls-route__base {
  fill: none;
  stroke: var(--c);
  stroke-opacity: 0.16;
  stroke-width: 10;
  stroke-linecap: round;
}

.ls-route__flow {
  fill: none;
  stroke: var(--c);
  stroke-opacity: 0.55;
  stroke-width: 1.5;
  stroke-dasharray: 2 10;
  stroke-linecap: round;
  animation: ls-dash linear infinite;
}

.ls-route__comet {
  fill: none;
  stroke: var(--c);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 90 910;
  animation: ls-comet linear infinite;
}

@keyframes ls-comet {
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
}

.ls-route__bus {
  fill: #fff;
  stroke: var(--c);
  stroke-width: 3;
}

.ls-stop__dot {
  fill: var(--ui-bg);
  stroke: var(--ls-blue);
  stroke-width: 3;
}

.ls-stop__ring {
  fill: var(--ls-blue);
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  animation: ls-ping 3.2s var(--ls-ease) infinite;
}

/* keeps the moving routes from running through the headline */
.ls-hero__veil {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 42% 48% at 24% 52%, color-mix(in oklab, var(--ui-bg) 88%, transparent) 30%, transparent 100%);
}

@media (max-width: 1023px) {
  .ls-hero__veil {
    background: radial-gradient(ellipse 90% 40% at 40% 28%, color-mix(in oklab, var(--ui-bg) 88%, transparent) 30%, transparent 100%);
  }
}

.ls-hero__fade {
  position: absolute;
  inset: auto 0 0;
  height: 12rem;
  background: linear-gradient(180deg, transparent, var(--ui-bg));
}

/* ---------- layout ---------- */
.ls-hero__inner {
  position: relative;
  width: 100%;
  max-width: var(--ui-container);
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  gap: 4rem;
  align-items: center;
}

@media (min-width: 640px) {
  .ls-hero__inner { padding: 0 1.5rem; }
}

@media (min-width: 1024px) {
  .ls-hero__inner {
    padding: 0 2rem;
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  }
}

/* entrance animation for above-the-fold content */
.ls-in {
  animation: ls-enter 1.1s var(--ls-ease) both;
  animation-delay: calc(var(--i) * 110ms + 100ms);
}

@keyframes ls-enter {
  from { opacity: 0; transform: translateY(26px); filter: blur(10px); }
  to { opacity: 1; transform: none; filter: none; }
}

/* ---------- copy ---------- */
.ls-hero__copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.75rem;
}

.ls-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.9rem 0.4rem 0.5rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--ui-text-toned);
  background: var(--ls-glass);
  border: 1px solid var(--ls-glass-border);
  backdrop-filter: blur(12px);
  box-shadow: var(--ls-shadow);
  transition: border-color 0.3s, transform 0.3s var(--ls-ease);
}

.ls-badge:hover {
  border-color: color-mix(in oklab, var(--ls-green-soft) 50%, transparent);
  transform: translateY(-1px);
}

.ls-badge__live {
  position: relative;
  display: grid;
  place-items: center;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 999px;
  background: color-mix(in oklab, var(--ls-green-soft) 18%, transparent);
}

.ls-badge__live span,
.ls-live-dot {
  position: relative;
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--ls-green-soft);
}

.ls-badge__live span::after,
.ls-live-dot::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: inherit;
  animation: ls-ping 2s var(--ls-ease) infinite;
}

.ls-badge__arrow {
  width: 0.9rem;
  height: 0.9rem;
  transition: transform 0.3s var(--ls-ease);
}

.ls-badge:hover .ls-badge__arrow { transform: translateX(3px); }

.ls-hero__title {
  margin: 0;
  display: flex;
  flex-direction: column;
  font-size: clamp(3rem, 7.2vw, 6rem);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.05em;
  color: var(--ui-text-highlighted);
}

.ls-hero__title .ls-gradient-text {
  padding-bottom: 0.08em;
}

.ls-hero__desc {
  margin: 0;
  max-width: 36rem;
  font-size: clamp(1.05rem, 1.4vw, 1.25rem);
  line-height: 1.65;
  color: var(--ui-text-muted);
  text-wrap: pretty;
}

.ls-hero__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
}

.ls-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  height: 3.1rem;
  padding: 0 1.4rem;
  border-radius: 0.9rem;
  font-weight: 600;
  font-size: 1rem;
  transition: transform 0.35s var(--ls-ease), box-shadow 0.35s var(--ls-ease), background-color 0.3s, border-color 0.3s;
}

.ls-btn__icon {
  width: 1.1rem;
  height: 1.1rem;
  transition: transform 0.35s var(--ls-ease);
}

.ls-btn:hover .ls-btn__icon { transform: translateX(3px); }
.ls-btn:hover { transform: translateY(-2px); }

.ls-btn--primary {
  color: #fff;
  background: linear-gradient(180deg, color-mix(in oklab, var(--ls-blue) 85%, #fff), var(--ls-blue));
  box-shadow:
    0 1px 0 0 rgb(255 255 255 / 0.35) inset,
    0 0 0 1px color-mix(in oklab, var(--ls-blue) 70%, #000),
    0 12px 32px -8px color-mix(in oklab, var(--ls-blue) 70%, transparent);
  overflow: hidden;
}

.ls-btn--primary::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 30%, rgb(255 255 255 / 0.35) 50%, transparent 70%);
  transform: translateX(-120%);
  animation: ls-sheen 4.5s var(--ls-ease) infinite 2s;
}

@keyframes ls-sheen {
  0%, 60% { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
}

.ls-btn--primary:hover {
  box-shadow:
    0 1px 0 0 rgb(255 255 255 / 0.35) inset,
    0 0 0 1px color-mix(in oklab, var(--ls-blue) 70%, #000),
    0 18px 40px -8px color-mix(in oklab, var(--ls-blue) 85%, transparent);
}

.ls-btn--ghost {
  color: var(--ui-text-highlighted);
  background: var(--ls-glass);
  border: 1px solid var(--ls-glass-border);
  backdrop-filter: blur(12px);
  box-shadow: var(--ls-shadow);
}

.ls-btn--ghost:hover { border-color: var(--ls-line-strong); }

.ls-hero__pieces {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  margin: 0.25rem 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.875rem;
  color: var(--ui-text-muted);
}

.ls-hero__pieces li {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.ls-hero__pieces li :deep(svg),
.ls-hero__pieces li > span {
  width: 1rem;
  height: 1rem;
  color: var(--ui-primary);
}

/* ---------- device stage ---------- */
.ls-stage {
  position: relative;
  height: clamp(440px, 52vw, 640px);
  perspective: 1600px;
}

.ls-stage__tilt {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: rotateY(calc(var(--px) * 10deg)) rotateX(calc(var(--py) * -8deg));
  transition: transform 0.6s var(--ls-ease);
}

.ls-stage__halo {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 70%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background:
    radial-gradient(closest-side, color-mix(in oklab, var(--ls-green-soft) 35%, transparent), transparent 70%),
    conic-gradient(from 0deg, transparent, color-mix(in oklab, var(--ls-blue) 30%, transparent), transparent 40%);
  filter: blur(30px);
  animation: ls-spin 18s linear infinite;
}

@keyframes ls-spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.ls-stage__phone {
  position: absolute;
  top: 50%;
  height: 92%;
}

.ls-stage__phone--back {
  left: 50%;
  transform: translate(-96%, -48%) rotate(-9deg) translateZ(-60px) scale(0.86);
  filter: saturate(0.9) brightness(0.92);
  animation: ls-bob-back 9s ease-in-out infinite;
}

.ls-stage__phone--front {
  left: 50%;
  transform: translate(-22%, -50%) rotate(4deg) translateZ(40px);
  animation: ls-bob-front 8s ease-in-out infinite;
}

@keyframes ls-bob-back {
  0%, 100% { transform: translate(-96%, -48%) rotate(-9deg) translateZ(-60px) scale(0.86); }
  50% { transform: translate(-96%, -51%) rotate(-8deg) translateZ(-60px) scale(0.86); }
}

@keyframes ls-bob-front {
  0%, 100% { transform: translate(-22%, -50%) rotate(4deg) translateZ(40px); }
  50% { transform: translate(-22%, -52.5%) rotate(3.2deg) translateZ(40px); }
}

/* card tap loop: 6s */
.ls-card-pass {
  position: absolute;
  z-index: 3;
  left: 6%;
  bottom: 8%;
  width: clamp(150px, 15vw, 210px);
  aspect-ratio: 1.586;
  padding: 0.8rem 0.9rem;
  border-radius: 0.9rem;
  color: #fff;
  background:
    radial-gradient(120% 140% at 100% 0%, rgb(255 255 255 / 0.28), transparent 50%),
    linear-gradient(135deg, #1d4ed8, #0ea5e9 55%, #10b981);
  box-shadow: 0 1px 0 rgb(255 255 255 / 0.4) inset, 0 24px 40px -16px rgb(2 6 23 / 0.6);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transform: translateZ(90px) rotate(-14deg);
  animation: ls-card-tap 6s var(--ls-ease) infinite;
}

@keyframes ls-card-tap {
  0%, 8% { transform: translateZ(90px) translate(0, 0) rotate(-14deg); }
  26%, 42% { transform: translateZ(90px) translate(clamp(70px, 9vw, 120px), clamp(-140px, -14vw, -90px)) rotate(-4deg); }
  60%, 100% { transform: translateZ(90px) translate(0, 0) rotate(-14deg); }
}

.ls-card-pass__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ls-card-pass__chip {
  width: 2rem;
  height: 1.5rem;
  border-radius: 0.3rem;
  background: linear-gradient(135deg, #fde68a, #d97706);
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.15);
}

.ls-card-pass__nfc {
  width: 1.25rem;
  height: 1.25rem;
  opacity: 0.9;
}

.ls-card-pass__name {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.ls-card-pass__num {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.75rem;
  opacity: 0.85;
}

.ls-tap {
  position: absolute;
  z-index: 2;
  transform: translateZ(100px);
  left: calc(6% + clamp(70px, 9vw, 120px) + 4%);
  bottom: calc(8% + clamp(90px, 14vw, 140px) + 2%);
  width: 0;
  height: 0;
}

.ls-tap span {
  position: absolute;
  left: -60px;
  top: -60px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid var(--ls-green-soft);
  opacity: 0;
  animation: ls-tap-wave 6s var(--ls-ease) infinite;
}

.ls-tap span:nth-child(2) { animation-delay: 0.25s; }
.ls-tap span:nth-child(3) { animation-delay: 0.5s; }

@keyframes ls-tap-wave {
  0%, 24% { transform: scale(0.2); opacity: 0; }
  27% { opacity: 0.9; }
  52%, 100% { transform: scale(2.2); opacity: 0; }
}

/* floating glass cards */
.ls-float {
  position: absolute;
  z-index: 4;
  padding: 0.75rem 0.9rem;
  border-radius: 1rem;
  background: var(--ls-glass);
  border: 1px solid var(--ls-glass-border);
  backdrop-filter: blur(16px) saturate(1.4);
  box-shadow: var(--ls-shadow);
  font-size: 0.8rem;
  transform: translateZ(120px);
}

.ls-float__row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.ls-float__icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 0.6rem;
  color: #fff;
}

.ls-float__icon :deep(svg),
.ls-float__icon > span {
  width: 1.1rem;
  height: 1.1rem;
}

.ls-float__icon--blue { background: linear-gradient(135deg, var(--ls-blue), var(--ls-sky)); }
.ls-float__icon--green { background: linear-gradient(135deg, var(--ls-green), var(--ls-green-soft)); }

.ls-float__title {
  font-weight: 600;
  color: var(--ui-text-highlighted);
  white-space: nowrap;
}

.ls-float__meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--ui-text-muted);
  font-size: 0.72rem;
  white-space: nowrap;
}

.ls-float--trip {
  top: 2%;
  right: 1%;
  width: 15.5rem;
  animation: ls-float 7s ease-in-out infinite;
}

.ls-float__progress {
  position: relative;
  height: 4px;
  margin-top: 0.7rem;
  border-radius: 99px;
  background: var(--ls-line-strong);
  overflow: hidden;
}

.ls-float__progress span {
  position: absolute;
  inset: 0 auto 0 0;
  width: 40%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--ls-blue), var(--ls-sky));
  animation: ls-progress 6s var(--ls-ease) infinite;
}

@keyframes ls-progress {
  0% { width: 8%; }
  90%, 100% { width: 92%; }
}

.ls-float--toast {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  right: 6%;
  bottom: 20%;
  animation: ls-toast 6s var(--ls-ease) infinite;
}

@keyframes ls-toast {
  0%, 28% { opacity: 0; transform: translateZ(120px) translateY(14px) scale(0.92); }
  34%, 80% { opacity: 1; transform: translateZ(120px) translateY(0) scale(1); }
  90%, 100% { opacity: 0; transform: translateZ(120px) translateY(-8px) scale(0.98); }
}

.ls-float__plus {
  margin-left: 0.3rem;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--ls-green-soft);
}

.ls-float--chart {
  left: -4%;
  top: 14%;
  width: 11.5rem;
  animation: ls-float 8s ease-in-out infinite -3s;
}

.ls-float__big {
  margin-top: 0.1rem;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--ui-text-highlighted);
  font-variant-numeric: tabular-nums;
}

.ls-spark {
  width: 100%;
  height: 2.6rem;
  margin-top: 0.3rem;
  overflow: visible;
}

.ls-spark__line {
  fill: none;
  stroke: var(--ls-green-soft);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: ls-draw 2.4s var(--ls-ease) forwards 1s;
}

.ls-spark__area {
  opacity: 0;
  animation: ls-fade-in 1.2s ease forwards 2s;
}

@keyframes ls-draw { to { stroke-dashoffset: 0; } }
@keyframes ls-fade-in { to { opacity: 1; } }

@keyframes ls-float {
  0%, 100% { transform: translateZ(120px) translateY(0); }
  50% { transform: translateZ(120px) translateY(-12px); }
}

/* scroll cue */
.ls-hero__scroll {
  position: absolute;
  left: 50%;
  bottom: 1.75rem;
  width: 1.5rem;
  height: 2.4rem;
  transform: translateX(-50%);
  border-radius: 999px;
  border: 1.5px solid var(--ls-line-strong);
}

.ls-hero__scroll span {
  position: absolute;
  left: 50%;
  top: 0.45rem;
  width: 3px;
  height: 0.5rem;
  margin-left: -1.5px;
  border-radius: 99px;
  background: var(--ui-text-muted);
  animation: ls-scroll 2s var(--ls-ease) infinite;
}

@keyframes ls-scroll {
  0% { transform: translateY(0); opacity: 1; }
  80%, 100% { transform: translateY(0.9rem); opacity: 0; }
}

/* ---------- small screens ---------- */
@media (max-width: 1023px) {
  .ls-hero { padding-top: 3rem; }
  .ls-stage { height: 500px; max-width: 560px; width: 100%; margin: 0 auto; }
  .ls-hero__scroll { display: none; }
}

@media (max-width: 639px) {
  .ls-stage { height: 420px; }
  .ls-float--chart { display: none; }
  .ls-float--trip { right: 0; top: 0; width: 12.5rem; }
  .ls-float--trip .ls-float__title,
  .ls-float--trip .ls-float__meta { white-space: normal; }
  .ls-float--toast { right: 0; bottom: 10%; }
  .ls-card-pass { left: 0; bottom: 4%; }
  .ls-tap { left: calc(clamp(70px, 9vw, 120px) + 4%); bottom: calc(4% + clamp(90px, 14vw, 140px) + 2%); }
}
</style>
