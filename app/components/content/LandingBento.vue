<script setup lang="ts">
// Grid of links into the docs. Each card has a small animated illustration
// and a border glow that follows the pointer.
type Visual = 'route' | 'dashboard' | 'phone' | 'nfc' | 'roles' | 'api'

withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  description?: string
  items?: { title: string, description: string, to: string, icon: string, visual: Visual, span?: number }[]
}>(), {
  items: () => [],
})

const root = ref<HTMLElement | null>(null)
useReveal(root)

function onMove(event: PointerEvent) {
  const card = event.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--x', `${event.clientX - rect.left}px`)
  card.style.setProperty('--y', `${event.clientY - rect.top}px`)
}

const roles = ['Super Admin', 'Admin', 'Dispatcher', 'Inspector', 'Driver', 'Report Viewer', 'Passenger']
</script>

<template>
  <section
    ref="root"
    class="ls-landing ls-bento"
  >
    <div class="ls-bento__inner">
      <LsHeading
        :eyebrow="eyebrow"
        :title="title || ''"
        :description="description"
      />

      <div class="ls-bento__grid">
        <NuxtLink
          v-for="(item, i) in items"
          :key="item.to + item.title"
          :to="item.to"
          class="ls-tile"
          :class="[`ls-tile--${item.visual}`, item.span === 3 ? 'ls-tile--wide' : item.span === 2 ? 'ls-tile--span2' : '']"
          data-reveal
          :style="{ '--d': `${(i % 3) * 90}ms` }"
          @pointermove="onMove"
        >
          <div class="ls-tile__visual">
            <!-- How it works: a little route with a bus going stop to stop -->
            <svg
              v-if="item.visual === 'route'"
              viewBox="0 0 520 150"
              class="ls-v-route"
            >
              <path
                id="ls-v-route-path"
                d="M 30 110 C 110 110 120 40 200 40 S 300 110 370 100 S 460 40 495 40"
                class="ls-v-route__base"
              />
              <path
                d="M 30 110 C 110 110 120 40 200 40 S 300 110 370 100 S 460 40 495 40"
                class="ls-v-route__fill"
                pathLength="1"
              />
              <g
                v-for="([x, y, label], k) in [[30, 110, 'Publish'], [200, 40, 'Start'], [370, 100, 'Board'], [495, 40, 'Report']]"
                :key="k"
              >
                <circle
                  :cx="x"
                  :cy="y"
                  r="9"
                  class="ls-v-route__stop"
                  :style="{ animationDelay: `${k * 1.1}s` }"
                />
                <text
                  :x="x"
                  :y="(y as number) - 22"
                  text-anchor="middle"
                  class="ls-v-label"
                >{{ label }}</text>
              </g>
              <circle
                r="7"
                class="ls-v-route__bus"
              >
                <animateMotion
                  dur="4.4s"
                  repeatCount="indefinite"
                  keyPoints="0;1;1"
                  keyTimes="0;0.85;1"
                  calcMode="linear"
                >
                  <mpath href="#ls-v-route-path" />
                </animateMotion>
              </circle>
            </svg>

            <!-- Admin: mini dashboard -->
            <div
              v-else-if="item.visual === 'dashboard'"
              class="ls-v-dash"
            >
              <div class="ls-v-dash__side">
                <i
                  v-for="k in 5"
                  :key="k"
                  :class="{ on: k === 2 }"
                />
              </div>
              <div class="ls-v-dash__main">
                <div class="ls-v-dash__kpis">
                  <span><b>12</b>Trips</span>
                  <span><b>9</b>Buses</span>
                  <span><b>214</b>On board</span>
                </div>
                <div class="ls-v-dash__bars">
                  <i
                    v-for="(h, k) in [40, 65, 50, 80, 58, 92, 70]"
                    :key="k"
                    :style="{ '--h': `${h}%`, '--k': k }"
                  />
                </div>
              </div>
            </div>

            <!-- Driver app: phone with hold-to-start -->
            <div
              v-else-if="item.visual === 'phone'"
              class="ls-v-phone"
            >
              <div class="ls-v-phone__body">
                <div class="ls-v-phone__map">
                  <span class="ls-v-phone__pin" />
                </div>
                <div class="ls-v-phone__btn">
                  <span />
                  Hold to start
                </div>
              </div>
            </div>

            <!-- Kiosk: card tapping a reader -->
            <div
              v-else-if="item.visual === 'nfc'"
              class="ls-v-nfc"
            >
              <div class="ls-v-nfc__reader">
                <UIcon name="i-lucide-check" />
              </div>
              <div class="ls-v-nfc__waves">
                <i /><i /><i />
              </div>
              <div class="ls-v-nfc__card" />
            </div>

            <!-- Roles: drifting chips -->
            <div
              v-else-if="item.visual === 'roles'"
              class="ls-v-roles"
            >
              <span
                v-for="(role, k) in roles"
                :key="role"
                :style="{ '--k': k }"
              >{{ role }}</span>
            </div>

            <!-- API: terminal -->
            <div
              v-else-if="item.visual === 'api'"
              class="ls-v-api"
            >
              <div class="ls-v-api__bar">
                <i /><i /><i />
                <span>api/v1</span>
              </div>
              <pre><code><span class="m">PATCH</span> /api/v1/driver/trips/<span class="v">{id}</span>/location
<span class="c">Authorization: Bearer ••••••••</span>
<span class="ok">200 OK</span> <span class="c">→ broadcast on</span> <span class="v">route.{id}</span>

<span class="m">POST</span>  /api/v1/scanner/taps
<span class="ok">201 Created</span> <span class="c">→ pending, verified in the queue</span><span class="cursor">▍</span></code></pre>
            </div>
          </div>

          <div class="ls-tile__body">
            <span class="ls-tile__icon"><UIcon :name="item.icon" /></span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
          <UIcon
            name="i-lucide-arrow-up-right"
            class="ls-tile__go"
          />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ls-bento {
  position: relative;
  padding: 6rem 0;
}

.ls-bento__inner {
  max-width: var(--ui-container);
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
}

@media (min-width: 640px) { .ls-bento__inner { padding: 0 1.5rem; } }
@media (min-width: 1024px) { .ls-bento__inner { padding: 0 2rem; } }

.ls-bento__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr);
}

@media (min-width: 768px) {
  .ls-bento__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ls-tile--wide { grid-column: span 2; }
}

@media (min-width: 1024px) {
  .ls-bento__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .ls-tile--span2 { grid-column: span 2; }
  .ls-tile--wide { grid-column: span 3; }
}

/* ---------- tile ---------- */
.ls-tile {
  --x: 50%;
  --y: 0%;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 22rem;
  border-radius: 1.5rem;
  background: var(--ls-card);
  border: 1px solid var(--ls-line);
  box-shadow: var(--ls-shadow);
  overflow: hidden;
  isolation: isolate;
  transition: transform 0.5s var(--ls-ease), box-shadow 0.5s var(--ls-ease);
}

/* glow that follows the pointer, on the fill and on the border */
.ls-tile::before,
.ls-tile::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s;
}

.ls-tile::before {
  z-index: -1;
  background: radial-gradient(420px circle at var(--x) var(--y), color-mix(in oklab, var(--ls-blue) 12%, transparent), transparent 60%);
}

.ls-tile::after {
  inset: -1px;
  padding: 1px;
  background: radial-gradient(300px circle at var(--x) var(--y), color-mix(in oklab, var(--ls-sky) 80%, transparent), transparent 60%);
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
}

.ls-tile:hover::before,
.ls-tile:hover::after { opacity: 1; }

.ls-tile:hover {
  transform: translateY(-4px);
  box-shadow: 0 30px 60px -30px color-mix(in oklab, var(--ls-blue) 45%, transparent), var(--ls-shadow);
}

.ls-tile__visual {
  position: relative;
  flex: 1;
  min-height: 11rem;
  display: grid;
  place-items: center;
  padding: 1.5rem 1.5rem 0;
  overflow: hidden;
  mask-image: linear-gradient(180deg, #000 70%, transparent);
}

.ls-tile__body {
  position: relative;
  padding: 1.25rem 1.5rem 1.6rem;
}

.ls-tile__icon {
  display: inline-grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  margin-bottom: 0.8rem;
  border-radius: 0.7rem;
  color: var(--ui-primary);
  background: color-mix(in oklab, var(--ui-primary) 12%, transparent);
  border: 1px solid color-mix(in oklab, var(--ui-primary) 20%, transparent);
}

.ls-tile__icon :deep(svg),
.ls-tile__icon > span {
  width: 1.15rem;
  height: 1.15rem;
}

.ls-tile h3 {
  margin: 0 0 0.35rem;
  font-size: 1.2rem;
  font-weight: 650;
  letter-spacing: -0.02em;
  color: var(--ui-text-highlighted);
}

.ls-tile p {
  margin: 0;
  max-width: 34rem;
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--ui-text-muted);
}

.ls-tile__go {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 1.15rem;
  height: 1.15rem;
  color: var(--ui-text-dimmed);
  transition: transform 0.4s var(--ls-ease), color 0.3s;
}

.ls-tile:hover .ls-tile__go {
  transform: translate(3px, -3px);
  color: var(--ui-primary);
}

/* wide API tile: text left, terminal right */
@media (min-width: 768px) {
  .ls-tile--wide {
    flex-direction: row-reverse;
    align-items: stretch;
    min-height: 17rem;
  }
  .ls-tile--wide .ls-tile__visual {
    padding: 1.5rem 1.5rem 0 0;
    place-items: end stretch;
    mask-image: linear-gradient(180deg, #000 75%, transparent);
  }
  .ls-tile--wide .ls-tile__body {
    flex: 0 0 38%;
    align-self: flex-end;
  }
}

/* ---------- visuals ---------- */
.ls-v-label {
  font-size: 14px;
  font-weight: 600;
  fill: var(--ui-text-muted);
}

.ls-v-route { width: 100%; max-width: 560px; overflow: visible; }

.ls-v-route__base {
  fill: none;
  stroke: var(--ls-line-strong);
  stroke-width: 10;
  stroke-linecap: round;
}

.ls-v-route__fill {
  fill: none;
  stroke: var(--ls-blue);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: ls-v-route 4.4s linear infinite;
}

@keyframes ls-v-route {
  0% { stroke-dashoffset: 1; }
  85%, 100% { stroke-dashoffset: 0; }
}

.ls-v-route__stop {
  fill: var(--ui-bg);
  stroke: var(--ls-blue);
  stroke-width: 4;
}

.ls-v-route__bus {
  fill: #fff;
  stroke: var(--ls-green-soft);
  stroke-width: 4;
  filter: drop-shadow(0 0 6px var(--ls-green-soft));
}

/* dashboard */
.ls-v-dash {
  display: flex;
  width: 100%;
  max-width: 20rem;
  height: 10rem;
  border-radius: 0.9rem;
  background: var(--ui-bg);
  border: 1px solid var(--ls-line-strong);
  box-shadow: 0 20px 40px -24px rgb(2 6 23 / 0.5);
  overflow: hidden;
  transform: rotate(-3deg) translateY(10px);
  transition: transform 0.6s var(--ls-ease);
}

.ls-tile:hover .ls-v-dash { transform: rotate(0) translateY(0); }

.ls-v-dash__side {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.8rem 0.6rem;
  border-right: 1px solid var(--ls-line);
}

.ls-v-dash__side i {
  width: 2.2rem;
  height: 0.45rem;
  border-radius: 99px;
  background: var(--ls-line-strong);
}

.ls-v-dash__side i.on { background: var(--ls-blue); }

.ls-v-dash__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.7rem;
}

.ls-v-dash__kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.35rem;
}

.ls-v-dash__kpis span {
  display: flex;
  flex-direction: column;
  padding: 0.3rem 0.4rem;
  border-radius: 0.4rem;
  border: 1px solid var(--ls-line);
  font-size: 0.55rem;
  color: var(--ui-text-muted);
}

.ls-v-dash__kpis b {
  font-size: 0.85rem;
  color: var(--ui-text-highlighted);
}

.ls-v-dash__bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 0.35rem;
}

.ls-v-dash__bars i {
  flex: 1;
  height: var(--h);
  border-radius: 0.25rem 0.25rem 0 0;
  background: linear-gradient(180deg, var(--ls-sky), var(--ls-blue));
  transform-origin: bottom;
  animation: ls-v-bar 3.2s var(--ls-ease) infinite alternate;
  animation-delay: calc(var(--k) * 120ms);
}

@keyframes ls-v-bar {
  from { transform: scaleY(0.35); }
  to { transform: scaleY(1); }
}

/* phone */
.ls-v-phone__body {
  width: 8.5rem;
  height: 13rem;
  padding: 0.45rem;
  border-radius: 1.4rem;
  background: #0b1220;
  box-shadow: 0 0 0 1px rgb(255 255 255 / 0.08) inset, 0 24px 40px -20px rgb(2 6 23 / 0.6);
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  transform: translateY(18px) rotate(6deg);
  transition: transform 0.6s var(--ls-ease);
}

.ls-tile:hover .ls-v-phone__body { transform: translateY(4px) rotate(0); }

.ls-v-phone__map {
  position: relative;
  flex: 1;
  border-radius: 1rem 1rem 0.5rem 0.5rem;
  background:
    linear-gradient(115deg, transparent 46%, #fcd34d 46% 50%, transparent 50%),
    linear-gradient(20deg, transparent 60%, #fde68a 60% 63%, transparent 63%),
    linear-gradient(0deg, #bfdbfe 0 18%, transparent 18%),
    #f1f5f9;
}

.ls-v-phone__pin {
  position: absolute;
  left: 48%;
  top: 42%;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 0 3px #fff;
}

.ls-v-phone__pin::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #ef4444;
  animation: ls-ping 1.8s var(--ls-ease) infinite;
}

.ls-v-phone__btn {
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
  height: 2rem;
  border-radius: 0.6rem;
  font-size: 0.62rem;
  font-weight: 700;
  color: #fff;
  background: #15803d;
}

.ls-v-phone__btn span {
  position: absolute;
  inset: 0;
  background: #22c55e;
  transform-origin: left;
  animation: ls-v-hold 2.8s var(--ls-ease) infinite;
}

.ls-v-phone__btn { isolation: isolate; }
.ls-v-phone__btn span { z-index: -1; }

@keyframes ls-v-hold {
  0% { transform: scaleX(0); }
  70%, 85% { transform: scaleX(1); }
  100% { transform: scaleX(1); opacity: 0; }
}

/* nfc */
.ls-v-nfc {
  position: relative;
  width: 14rem;
  height: 10rem;
}

.ls-v-nfc__reader {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  display: grid;
  place-items: center;
  width: 5.5rem;
  height: 8rem;
  transform: translateY(-50%);
  border-radius: 1rem;
  color: #fff;
  background: linear-gradient(180deg, #16a34a, #166534);
  box-shadow: 0 0 0 4px #0b1220, 0 20px 40px -20px rgb(2 6 23 / 0.6);
  animation: ls-v-ok 3s var(--ls-ease) infinite;
}

.ls-v-nfc__reader :deep(svg),
.ls-v-nfc__reader > span {
  width: 2rem;
  height: 2rem;
  animation: ls-v-check 3s var(--ls-ease) infinite;
}

@keyframes ls-v-ok {
  0%, 30% { filter: grayscale(1) brightness(0.55); }
  40%, 85% { filter: none; }
  100% { filter: grayscale(1) brightness(0.55); }
}

@keyframes ls-v-check {
  0%, 32% { transform: scale(0); }
  42% { transform: scale(1.2); }
  50%, 85% { transform: scale(1); }
  100% { transform: scale(0); }
}

.ls-v-nfc__card {
  position: absolute;
  left: 0;
  top: 50%;
  width: 6.5rem;
  height: 4.1rem;
  margin-top: -2rem;
  border-radius: 0.55rem;
  background:
    radial-gradient(120% 140% at 100% 0%, rgb(255 255 255 / 0.3), transparent 50%),
    linear-gradient(135deg, #1d4ed8, #0ea5e9 55%, #10b981);
  box-shadow: 0 14px 30px -12px rgb(2 6 23 / 0.6);
  animation: ls-v-card 3s var(--ls-ease) infinite;
}

@keyframes ls-v-card {
  0%, 5% { transform: translateX(0) rotate(-10deg); }
  30%, 55% { transform: translateX(4.4rem) rotate(0); }
  85%, 100% { transform: translateX(0) rotate(-10deg); }
}

.ls-v-nfc__waves {
  position: absolute;
  right: 3.25rem;
  top: 50%;
}

.ls-v-nfc__waves i {
  position: absolute;
  left: -2rem;
  top: -2rem;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  border: 2px solid var(--ls-green-soft);
  opacity: 0;
  animation: ls-v-wave 3s var(--ls-ease) infinite;
}

.ls-v-nfc__waves i:nth-child(2) { animation-delay: 0.2s; }
.ls-v-nfc__waves i:nth-child(3) { animation-delay: 0.4s; }

@keyframes ls-v-wave {
  0%, 28% { transform: scale(0.3); opacity: 0; }
  32% { opacity: 1; }
  60%, 100% { transform: scale(2); opacity: 0; }
}

/* roles */
.ls-v-roles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  max-width: 18rem;
}

.ls-v-roles span {
  padding: 0.4rem 0.8rem;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ui-text-toned);
  background: var(--ui-bg);
  border: 1px solid var(--ls-line-strong);
  box-shadow: 0 6px 16px -10px rgb(2 6 23 / 0.4);
  animation: ls-v-role 6s ease-in-out infinite;
  animation-delay: calc(var(--k) * -0.85s);
}

.ls-v-roles span:nth-child(1),
.ls-v-roles span:nth-child(5) {
  color: #fff;
  border-color: transparent;
  background: linear-gradient(135deg, var(--ls-blue), var(--ls-sky));
}

@keyframes ls-v-role {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* api terminal */
.ls-v-api {
  width: 100%;
  max-width: 44rem;
  align-self: end;
  border-radius: 0.9rem 0.9rem 0 0;
  background: #0b1220;
  border: 1px solid rgb(255 255 255 / 0.08);
  border-bottom: 0;
  box-shadow: 0 30px 60px -30px rgb(2 6 23 / 0.7);
  overflow: hidden;
}

.ls-v-api__bar {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.6rem 0.8rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.06);
}

.ls-v-api__bar i {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.15);
}

.ls-v-api__bar span {
  margin-left: 0.5rem;
  font-size: 0.7rem;
  color: rgb(255 255 255 / 0.45);
}

.ls-v-api pre {
  margin: 0;
  padding: 1rem 1.1rem 1.4rem;
  font-size: 0.8rem;
  line-height: 1.7;
  color: #e2e8f0;
  white-space: pre-wrap;
  word-break: break-word;
}

.ls-v-api .m { color: #60a5fa; font-weight: 700; }
.ls-v-api .v { color: #fbbf24; }
.ls-v-api .c { color: #64748b; }
.ls-v-api .ok { color: #34d399; font-weight: 700; }

.ls-v-api .cursor {
  color: #34d399;
  animation: ls-blink 1s steps(1) infinite;
}
</style>
