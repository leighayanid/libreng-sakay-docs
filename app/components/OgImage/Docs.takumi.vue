<script lang="ts" setup>
// Social preview (Open Graph) image for every docs page, 1200 x 630.
// Replaces Docus's default `Docs` template. Rendered at build time by nuxt-og-image (Takumi).
// `headline` is the sidebar section (Start here, Admin, Driver app, Kiosk, API).
const { title, description, headline } = defineProps<{ title?: string, description?: string, headline?: string }>()

// Each section gets the colour it has on the landing page.
const sections: Record<string, { color: string, glow: string, icon: string }> = {
  'Admin': {
    color: '#60a5fa',
    glow: '37, 99, 235',
    icon: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  },
  'Driver app': {
    color: '#38bdf8',
    glow: '14, 165, 233',
    icon: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  },
  'Kiosk': {
    color: '#34d399',
    glow: '16, 185, 129',
    icon: '<path d="M6 8.32a7.43 7.43 0 0 1 0 7.36m3.46-9.47a11.76 11.76 0 0 1 0 11.58M12.91 4.1a15.91 15.91 0 0 1 .01 15.8M16.37 2a20.16 20.16 0 0 1 0 20"/>',
  },
  'API': {
    color: '#fbbf24',
    glow: '217, 119, 6',
    icon: '<path d="M12 22v-5m3-9V2m2 6a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1zM9 8V2"/>',
  },
}
const fallback = {
  color: '#60a5fa',
  glow: '37, 99, 235',
  icon: '<path d="M9 5h8.5a1 1 0 0 1 0 7h-11a1 1 0 0 0 0 7H15"/><circle cx="18" cy="19" r="3"/><circle cx="6" cy="5" r="3"/>',
}
const section = (headline && sections[headline]) || fallback
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><g fill="none" stroke="${section.color}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">${section.icon}</g></svg>`

const titleSize = (title?.length ?? 0) > 34 ? 60 : 72
</script>

<template>
  <div
    class="w-full h-full flex flex-col relative"
    style="background-color: #050b1a; color: #f8fafc; padding: 56px 72px 52px;"
  >
    <!-- Glow in the section colour -->
    <div
      class="absolute"
      :style="{ top: '-300px', right: '-240px', width: '900px', height: '900px', backgroundImage: `radial-gradient(circle, rgba(${section.glow}, 0.40) 0%, rgba(${section.glow}, 0.10) 40%, transparent 68%)` }"
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
      <!-- A bus route winding through the top-right corner -->
      <path
        d="M700 -20 C 760 120, 900 60, 960 170 S 1080 300, 1230 250"
        fill="none"
        :stroke="section.color"
        stroke-opacity="0.55"
        stroke-width="4"
        stroke-linecap="round"
        stroke-dasharray="2 14"
      />
      <circle
        cx="960"
        cy="170"
        r="9"
        fill="#050b1a"
        :stroke="section.color"
        stroke-width="4"
      />
      <circle
        cx="1104"
        cy="268"
        r="9"
        fill="#050b1a"
        :stroke="section.color"
        stroke-width="4"
      />
    </svg>

    <!-- Brand -->
    <div class="flex items-center relative">
      <div
        class="flex items-center justify-center"
        style="width: 48px; height: 48px; border-radius: 14px; background-image: linear-gradient(135deg, #2563eb 0%, #0ea5e9 55%, #10b981 100%);"
      >
        <svg
          width="28"
          height="28"
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
      <span style="margin-left: 16px; font-size: 24px; font-weight: 700;">Libreng Sakay</span>
      <span style="margin-left: 10px; font-size: 24px; font-weight: 400; color: #64748b;">Developer Docs</span>
    </div>

    <!-- Page -->
    <div
      class="flex flex-col relative"
      style="margin-top: auto; margin-bottom: auto; max-width: 980px;"
    >
      <div
        v-if="headline"
        class="flex items-center"
        style="margin-bottom: 26px;"
      >
        <div
          class="flex items-center justify-center"
          :style="{ width: '64px', height: '64px', borderRadius: '18px', border: `1px solid ${section.color}55`, backgroundColor: `rgba(${section.glow}, 0.16)` }"
        >
          <img
            :src="`data:image/svg+xml;utf8,${encodeURIComponent(iconSvg)}`"
            width="40"
            height="40"
          >
        </div>
        <span
          :style="{ marginLeft: '20px', fontSize: '26px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: section.color }"
        >{{ headline }}</span>
      </div>
      <h1
        v-if="title"
        :style="{ margin: 0, fontSize: `${titleSize}px`, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#f8fafc' }"
      >
        {{ title }}
      </h1>
      <p
        v-if="description"
        style="margin: 22px 0 0; font-size: 30px; line-height: 1.4; color: #94a3b8;"
      >
        {{ description }}
      </p>
    </div>

    <!-- Footer route strip -->
    <div
      class="flex items-center w-full relative"
      style="font-size: 18px; color: #64748b;"
    >
      <div style="width: 14px; height: 14px; border-radius: 999px; border: 3px solid #3b82f6;" />
      <div style="flex: 1; height: 3px; margin: 0 10px; border-radius: 3px; background-image: linear-gradient(90deg, #3b82f6 0%, #f59e0b 36%, #38bdf8 66%, #10b981 100%); opacity: 0.8;" />
      <div style="width: 14px; height: 14px; border-radius: 999px; border: 3px solid #10b981;" />
      <span style="margin-left: 18px;">Admin · Driver app · Kiosk · API</span>
    </div>
  </div>
</template>
