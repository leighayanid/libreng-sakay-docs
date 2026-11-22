<script lang="ts" setup>
// Social preview (Open Graph) image for the landing page, 1200 x 630.
// Replaces Docus's default `Landing` template. Rendered at build time by nuxt-og-image (Takumi).
const { title, description } = defineProps<{ title?: string, description?: string }>()

// "Libreng Sakay Developer Docs" -> highlight "Libreng Sakay", then the rest on its own line.
const brand = 'Libreng Sakay'
const rest = (title || 'Developer Docs').replace(brand, '').trim() || 'Developer Docs'

const stops = [
  { label: 'Admin web app', color: '#3b82f6' },
  { label: 'App API', color: '#f59e0b' },
  { label: 'Driver app', color: '#38bdf8' },
  { label: 'Bus kiosk', color: '#10b981' },
]
</script>

<template>
  <div
    class="w-full h-full flex flex-col relative"
    style="background-color: #050b1a; color: #f8fafc; padding: 56px 72px 48px;"
  >
    <!-- Glows -->
    <div
      class="absolute"
      style="top: -260px; right: -200px; width: 900px; height: 900px; background-image: radial-gradient(circle, rgba(37, 99, 235, 0.42) 0%, rgba(37, 99, 235, 0.12) 38%, transparent 68%);"
    />
    <div
      class="absolute"
      style="bottom: -380px; left: -260px; width: 900px; height: 900px; background-image: radial-gradient(circle, rgba(16, 185, 129, 0.26) 0%, rgba(16, 185, 129, 0.06) 40%, transparent 68%);"
    />
    <!-- Faint map grid -->
    <svg
      class="absolute"
      style="top: 0; left: 0;"
      width="1200"
      height="630"
      viewBox="0 0 1200 630"
    >
      <g
        stroke="#ffffff"
        stroke-opacity="0.045"
        stroke-width="1"
      >
        <path d="M0 90H1200M0 180H1200M0 270H1200M0 360H1200M0 450H1200M0 540H1200" />
        <path d="M120 0V630M240 0V630M360 0V630M480 0V630M600 0V630M720 0V630M840 0V630M960 0V630M1080 0V630" />
      </g>
    </svg>

    <!-- Top row -->
    <div class="flex items-center justify-between w-full relative">
      <div class="flex items-center">
        <div
          class="flex items-center justify-center"
          style="width: 56px; height: 56px; border-radius: 16px; background-image: linear-gradient(135deg, #2563eb 0%, #0ea5e9 55%, #10b981 100%);"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="#ffffff"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <path d="M8 6v6m7-6v6M2 12h19.6M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2s-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
              <circle
                cx="7"
                cy="18"
                r="2"
              />
              <path d="M9 18h5" />
              <circle
                cx="16"
                cy="18"
                r="2"
              />
            </g>
          </svg>
        </div>
        <span style="margin-left: 18px; font-size: 26px; font-weight: 700; letter-spacing: -0.01em;">Libreng Sakay</span>
        <span
          style="margin-left: 12px; font-size: 18px; font-weight: 600; color: #93c5fd; padding: 4px 12px; border-radius: 999px; border: 1px solid rgba(147, 197, 253, 0.35); background-color: rgba(37, 99, 235, 0.15);"
        >Docs</span>
      </div>
      <div
        class="flex items-center"
        style="font-size: 18px; color: #cbd5e1; padding: 8px 18px; border-radius: 999px; border: 1px solid rgba(255, 255, 255, 0.14); background-color: rgba(255, 255, 255, 0.05);"
      >
        <div style="width: 10px; height: 10px; border-radius: 999px; background-color: #10b981; margin-right: 10px;" />
        Province of Bataan · Free bus service
      </div>
    </div>

    <!-- Title -->
    <div
      class="flex flex-col relative"
      style="margin-top: 44px;"
    >
      <div
        style="font-size: 84px; font-weight: 800; line-height: 1.12; padding-bottom: 4px; letter-spacing: -0.035em; background-image: linear-gradient(100deg, #60a5fa 0%, #38bdf8 45%, #34d399 100%); background-clip: text; color: transparent;"
      >
        {{ brand }}
      </div>
      <div style="font-size: 84px; font-weight: 800; line-height: 1.05; letter-spacing: -0.035em; color: #f8fafc;">
        {{ rest }}
      </div>
      <p
        v-if="description"
        style="margin: 22px 0 0; font-size: 26px; line-height: 1.4; color: #94a3b8; max-width: 860px;"
      >
        {{ description }}
      </p>
    </div>

    <!-- Route line: the four parts of the system as stops -->
    <div
      class="flex flex-col relative w-full"
      style="margin-top: auto;"
    >
      <div
        class="flex w-full relative"
        style="height: 22px; align-items: center;"
      >
        <div
          class="absolute"
          style="left: 11px; right: 11px; top: 9px; height: 4px; border-radius: 4px; background-image: linear-gradient(90deg, #3b82f6 0%, #f59e0b 36%, #38bdf8 66%, #10b981 100%);"
        />
        <div
          class="flex w-full justify-between"
          style="align-items: center;"
        >
          <div
            v-for="stop in stops"
            :key="stop.label"
            style="width: 22px; height: 22px; border-radius: 999px; background-color: #050b1a; display: flex; align-items: center; justify-content: center;"
            :style="{ border: `4px solid ${stop.color}` }"
          />
        </div>
      </div>
      <div
        class="flex w-full justify-between"
        style="margin-top: 14px; font-size: 20px; font-weight: 600; color: #e2e8f0;"
      >
        <span
          v-for="(stop, i) in stops"
          :key="stop.label"
          :style="{ textAlign: i === 0 ? 'left' : i === stops.length - 1 ? 'right' : 'center' }"
        >{{ stop.label }}</span>
      </div>
    </div>
  </div>
</template>
