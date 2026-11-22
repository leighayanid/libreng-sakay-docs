<script setup lang="ts">
// Diagram of how the three apps talk to the App API, with data moving along the links.
withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  description?: string
}>(), {})

const root = ref<HTMLElement | null>(null)
useReveal(root)
const uid = useId()
const id = (name: string) => `${uid}-${name}`

// Coordinates are in the 1000 x 520 SVG viewBox. Cards are placed at the same spots in percent.
const nodes = [
  {
    key: 'admin',
    x: 150,
    y: 260,
    icon: 'i-lucide-layout-dashboard',
    tone: 'blue',
    title: 'Admin web app',
    tag: 'Laravel · Vue · Inertia',
    text: 'Buses, routes, schedules, kiosks and the live map.',
    to: '/admin/overview',
  },
  {
    key: 'driver',
    x: 850,
    y: 110,
    icon: 'i-lucide-smartphone',
    tone: 'sky',
    title: 'Driver app',
    tag: 'Android · Kotlin',
    text: 'Start and end trips, mark stops, send GPS.',
    to: '/driver-app/overview',
  },
  {
    key: 'kiosk',
    x: 850,
    y: 410,
    icon: 'i-lucide-nfc',
    tone: 'green',
    title: 'Kiosk',
    tag: 'Boarding mode · NFC · QR',
    text: 'Passengers tap in. Taps are saved even offline.',
    to: '/kiosk/overview',
  },
]

const links = [
  { key: 'admin', d: 'M 265 260 L 420 260', label: 'Schedules · live counts', lx: 342, ly: 240, tone: 'blue', dur: 3.2 },
  { key: 'driver', d: 'M 572 222 C 640 170 660 110 735 110', label: 'GPS every 5 s', lx: 640, ly: 132, tone: 'sky', dur: 2.6 },
  { key: 'kiosk', d: 'M 572 298 C 640 350 660 410 735 410', label: 'Taps · offline-safe', lx: 640, ly: 398, tone: 'green', dur: 2.9 },
  { key: 'pass', d: 'M 500 340 L 500 445', label: '', lx: 0, ly: 0, tone: 'amber', dur: 2.2 },
]

const pct = (x: number, y: number) => ({ left: `${x / 10}%`, top: `${(y / 520) * 100}%` })
</script>

<template>
  <section
    id="ls-flow"
    ref="root"
    class="ls-landing ls-flow"
  >
    <div class="ls-flow__inner">
      <LsHeading
        :eyebrow="eyebrow"
        :title="title || ''"
        :description="description"
      />

      <!-- Desktop diagram -->
      <div
        class="ls-diagram"
        data-reveal
        style="--d: 200ms"
      >
        <div class="ls-diagram__dots" />
        <svg
          class="ls-diagram__svg"
          viewBox="0 0 1000 520"
          aria-hidden="true"
        >
          <defs>
            <filter
              :id="id('glow')"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="3" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g
            v-for="link in links"
            :key="link.key"
            :class="`ls-link ls-link--${link.tone}`"
          >
            <path
              :id="id(link.key)"
              :d="link.d"
              class="ls-link__base"
            />
            <path
              :d="link.d"
              class="ls-link__dash"
              pathLength="1000"
            />
            <!-- packets going out from the API -->
            <circle
              r="4.5"
              class="ls-link__packet"
              :filter="`url(#${id('glow')})`"
            >
              <animateMotion
                :dur="`${link.dur}s`"
                repeatCount="indefinite"
                keyPoints="1;0"
                keyTimes="0;1"
                calcMode="linear"
              >
                <mpath :href="`#${id(link.key)}`" />
              </animateMotion>
            </circle>
            <!-- packets coming in to the API -->
            <circle
              r="4.5"
              class="ls-link__packet ls-link__packet--in"
              :filter="`url(#${id('glow')})`"
            >
              <animateMotion
                :dur="`${link.dur}s`"
                :begin="`${link.dur / 2}s`"
                repeatCount="indefinite"
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="linear"
              >
                <mpath :href="`#${id(link.key)}`" />
              </animateMotion>
            </circle>
            <text
              v-if="link.label"
              :x="link.lx"
              :y="link.ly"
              text-anchor="middle"
              class="ls-link__label"
            >{{ link.label }}</text>
          </g>
        </svg>

        <!-- API hub -->
        <div
          class="ls-hub"
          :style="pct(500, 260)"
        >
          <div class="ls-hub__ring" />
          <div class="ls-hub__pulse" />
          <div class="ls-hub__pulse ls-hub__pulse--2" />
          <div class="ls-hub__core">
            <UIcon
              name="i-lucide-server"
              class="ls-hub__icon"
            />
            <strong>App API</strong>
            <code>/api/v1</code>
            <span class="ls-hub__live"><span class="ls-dot" />Reverb live</span>
          </div>
        </div>

        <!-- Bataeño Pass -->
        <NuxtLink
          to="/getting-started/introduction"
          class="ls-pass"
          :style="pct(500, 470)"
        >
          <UIcon name="i-lucide-shield-check" />
          Bataeño Pass
          <span>sign-in · checks every pass</span>
        </NuxtLink>

        <!-- App nodes -->
        <NuxtLink
          v-for="node in nodes"
          :key="node.key"
          :to="node.to"
          class="ls-node"
          :class="`ls-node--${node.tone}`"
          :style="pct(node.x, node.y)"
        >
          <span class="ls-node__icon">
            <UIcon :name="node.icon" />
          </span>
          <span class="ls-node__tag">{{ node.tag }}</span>
          <strong class="ls-node__title">{{ node.title }}</strong>
          <span class="ls-node__text">{{ node.text }}</span>
          <UIcon
            name="i-lucide-arrow-up-right"
            class="ls-node__go"
          />
        </NuxtLink>
      </div>

      <!-- Mobile: stacked -->
      <div class="ls-stack">
        <template
          v-for="(node, i) in [nodes[0], { key: 'api' }, nodes[1], nodes[2]]"
          :key="node!.key"
        >
          <div
            v-if="i > 0"
            class="ls-stack__link"
            data-reveal
          >
            <span />
          </div>
          <div
            v-if="node!.key === 'api'"
            class="ls-stack__api"
            data-reveal
          >
            <UIcon name="i-lucide-server" />
            <div>
              <strong>App API</strong> <code>/api/v1</code>
              <p>One server for everything. Live updates over Reverb.</p>
            </div>
          </div>
          <NuxtLink
            v-else
            :to="(node as typeof nodes[number]).to"
            class="ls-node ls-node--static"
            :class="`ls-node--${(node as typeof nodes[number]).tone}`"
            data-reveal
          >
            <span class="ls-node__icon">
              <UIcon :name="(node as typeof nodes[number]).icon" />
            </span>
            <span class="ls-node__tag">{{ (node as typeof nodes[number]).tag }}</span>
            <strong class="ls-node__title">{{ (node as typeof nodes[number]).title }}</strong>
            <span class="ls-node__text">{{ (node as typeof nodes[number]).text }}</span>
          </NuxtLink>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ls-flow {
  position: relative;
  padding: 6rem 0;
}

.ls-flow__inner {
  max-width: var(--ui-container);
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
}

@media (min-width: 640px) { .ls-flow__inner { padding: 0 1.5rem; } }
@media (min-width: 1024px) { .ls-flow__inner { padding: 0 2rem; } }

/* ---------- diagram ---------- */
.ls-diagram {
  position: relative;
  display: none;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  aspect-ratio: 1000 / 520;
  border-radius: 2rem;
  border: 1px solid var(--ls-line);
  background:
    radial-gradient(60% 70% at 50% 50%, color-mix(in oklab, var(--ls-blue) 10%, transparent), transparent 70%),
    var(--ls-card);
  box-shadow: var(--ls-shadow);
  overflow: hidden;
}

@media (min-width: 900px) {
  .ls-diagram { display: block; }
  .ls-stack { display: none !important; }
}

.ls-diagram__dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--ls-line-strong) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: radial-gradient(ellipse at center, #000 20%, transparent 75%);
}

.ls-diagram__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.ls-link { --c: var(--ls-blue); }
.ls-link--sky { --c: var(--ls-sky); }
.ls-link--green { --c: var(--ls-green-soft); }
.ls-link--amber { --c: var(--ls-amber); }

.ls-link__base {
  fill: none;
  stroke: var(--c);
  stroke-opacity: 0.18;
  stroke-width: 8;
  stroke-linecap: round;
}

.ls-link__dash {
  fill: none;
  stroke: var(--c);
  stroke-opacity: 0.7;
  stroke-width: 1.5;
  stroke-dasharray: 4 10;
  animation: ls-dash 30s linear infinite;
}

.ls-link__packet {
  fill: var(--c);
}

.ls-link__packet--in {
  fill: #fff;
  stroke: var(--c);
  stroke-width: 2;
}

.ls-link__label {
  font-size: 13px;
  font-weight: 600;
  fill: var(--ui-text-muted);
  paint-order: stroke;
  stroke: var(--ui-bg);
  stroke-width: 6px;
  stroke-linejoin: round;
}

/* hub */
.ls-hub {
  position: absolute;
  width: 17%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
}

.ls-hub__ring {
  position: absolute;
  inset: -6%;
  border-radius: 50%;
  background: conic-gradient(from 0deg, var(--ls-blue), var(--ls-sky), var(--ls-green-soft), transparent 70%, var(--ls-blue));
  mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px));
  animation: ls-hub-spin 6s linear infinite;
}

@keyframes ls-hub-spin { to { transform: rotate(360deg); } }

.ls-hub__pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid color-mix(in oklab, var(--ls-blue) 60%, transparent);
  animation: ls-hub-pulse 3s var(--ls-ease) infinite;
}

.ls-hub__pulse--2 { animation-delay: 1.5s; }

@keyframes ls-hub-pulse {
  from { transform: scale(1); opacity: 0.8; }
  to { transform: scale(1.7); opacity: 0; }
}

.ls-hub__core {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  text-align: center;
  background:
    radial-gradient(circle at 30% 25%, color-mix(in oklab, var(--ls-blue) 30%, transparent), transparent 60%),
    var(--ui-bg);
  border: 1px solid var(--ls-glass-border);
  box-shadow:
    0 0 60px -10px color-mix(in oklab, var(--ls-blue) 60%, transparent),
    var(--ls-shadow);
}

.ls-hub__icon {
  width: 1.6rem;
  height: 1.6rem;
  color: var(--ui-primary);
  margin-bottom: 0.15rem;
}

.ls-hub__core strong {
  font-size: 1.05rem;
  color: var(--ui-text-highlighted);
  letter-spacing: -0.02em;
}

.ls-hub__core code {
  font-size: 0.78rem;
  color: var(--ui-text-muted);
}

.ls-hub__live {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.35rem;
  padding: 0.15rem 0.5rem;
  border-radius: 99px;
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--ls-green-soft);
  background: color-mix(in oklab, var(--ls-green-soft) 14%, transparent);
}

.ls-dot {
  position: relative;
  width: 0.4rem;
  height: 0.4rem;
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

/* Bataeño Pass pill */
.ls-pass {
  position: absolute;
  transform: translate(-50%, -50%);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  color: var(--ui-text-highlighted);
  background: var(--ls-glass);
  border: 1px solid color-mix(in oklab, var(--ls-amber) 40%, transparent);
  backdrop-filter: blur(12px);
  box-shadow: var(--ls-shadow);
  transition: transform 0.3s var(--ls-ease);
}

.ls-pass:hover { transform: translate(-50%, calc(-50% - 2px)); }

.ls-pass :deep(svg),
.ls-pass > span:first-child {
  width: 1.05rem;
  height: 1.05rem;
  color: var(--ls-amber);
}

.ls-pass > span:last-child {
  font-weight: 400;
  color: var(--ui-text-muted);
}

/* nodes */
.ls-node {
  --c: var(--ls-blue);
  position: absolute;
  width: clamp(200px, 23%, 250px);
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1.1rem 1.15rem 1.2rem;
  border-radius: 1.25rem;
  background: var(--ls-glass);
  border: 1px solid var(--ls-glass-border);
  backdrop-filter: blur(14px);
  box-shadow: var(--ls-shadow);
  transition: transform 0.45s var(--ls-ease), border-color 0.3s, box-shadow 0.45s var(--ls-ease);
}

.ls-node--sky { --c: var(--ls-sky); }
.ls-node--green { --c: var(--ls-green-soft); }

.ls-node::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(160deg, color-mix(in oklab, var(--c) 70%, transparent), transparent 45%);
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  pointer-events: none;
}

.ls-node:hover {
  transform: translate(-50%, calc(-50% - 4px));
  box-shadow: 0 24px 50px -20px color-mix(in oklab, var(--c) 55%, transparent), var(--ls-shadow);
}

.ls-node__icon {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  margin-bottom: 0.35rem;
  border-radius: 0.75rem;
  color: #fff;
  background: linear-gradient(135deg, var(--c), color-mix(in oklab, var(--c) 55%, #000));
  box-shadow: 0 8px 20px -8px var(--c);
}

.ls-node__icon :deep(svg),
.ls-node__icon > span {
  width: 1.25rem;
  height: 1.25rem;
}

.ls-node__tag {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c);
}

.ls-node__title {
  font-size: 1.05rem;
  color: var(--ui-text-highlighted);
  letter-spacing: -0.015em;
}

.ls-node__text {
  font-size: 0.85rem;
  line-height: 1.45;
  color: var(--ui-text-muted);
}

.ls-node__go {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 1rem;
  height: 1rem;
  color: var(--ui-text-dimmed);
  transition: transform 0.35s var(--ls-ease), color 0.3s;
}

.ls-node:hover .ls-node__go {
  transform: translate(2px, -2px);
  color: var(--c);
}

/* ---------- mobile stack ---------- */
.ls-stack {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-width: 28rem;
  width: 100%;
  margin: 0 auto;
}

.ls-node--static {
  position: relative;
  width: auto;
  transform: none;
}

.ls-node--static:hover { transform: translateY(-3px); }

.ls-stack__link {
  position: relative;
  height: 2.75rem;
}

.ls-stack__link span {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: repeating-linear-gradient(180deg, var(--ls-blue) 0 4px, transparent 4px 10px);
  background-size: 2px 20px;
  animation: ls-stack-flow 1s linear infinite;
}

@keyframes ls-stack-flow { to { background-position: 0 20px; } }

.ls-stack__api {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
  border-radius: 1.25rem;
  background:
    radial-gradient(circle at 0 0, color-mix(in oklab, var(--ls-blue) 22%, transparent), transparent 60%),
    var(--ls-card);
  border: 1px solid color-mix(in oklab, var(--ls-blue) 40%, transparent);
  box-shadow: var(--ls-shadow);
}

.ls-stack__api > span:first-child,
.ls-stack__api > :deep(svg) {
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  color: var(--ui-primary);
}

.ls-stack__api strong { color: var(--ui-text-highlighted); }
.ls-stack__api code { font-size: 0.8rem; color: var(--ui-text-muted); }
.ls-stack__api p { margin: 0.2rem 0 0; font-size: 0.85rem; color: var(--ui-text-muted); }
</style>
