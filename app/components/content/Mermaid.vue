<script setup lang="ts">
// Renders a Mermaid diagram (https://mermaid.js.org) in the browser.
// In Markdown, write a fenced code block with the `mermaid` language (see ProsePre.vue):
//
//   ```mermaid
//   flowchart LR
//     A[Admin] --> B[API]
//     class A admin
//   ```
//
// Nodes can be coloured by the part of the system they belong to with
// `class <node ids> admin|driver|kiosk|server|pass|danger|ok`. The colours come from app.css,
// so they follow light and dark mode.
const props = defineProps<{
  code: string
  caption?: string
}>()

const colorMode = useColorMode()
const container = ref<HTMLElement | null>(null)
const svg = ref('')
const error = ref('')
const showSource = ref(false)
const expanded = ref(false)
const uid = useId().replace(/[^\w-]/g, '')
let renderCount = 0

// Mermaid needs plain hex colours (it derives shades from them), so the palette lives here.
const palettes = {
  light: {
    background: '#ffffff',
    primaryColor: '#eff6ff',
    primaryBorderColor: '#93c5fd',
    primaryTextColor: '#0f172a',
    secondaryColor: '#f1f5f9',
    tertiaryColor: '#f8fafc',
    lineColor: '#94a3b8',
    textColor: '#334155',
    clusterBkg: '#f8fafc',
    clusterBorder: '#cbd5e1',
    edgeLabelBackground: '#ffffff',
    actorBkg: '#eff6ff',
    actorBorder: '#93c5fd',
    signalColor: '#475569',
    noteBkgColor: '#fffbeb',
    noteBorderColor: '#fcd34d',
    noteTextColor: '#78350f',
    actorTextColor: '#0f172a',
    sequenceNumberColor: '#ffffff',
  },
  dark: {
    background: '#020617',
    primaryColor: '#172554',
    primaryBorderColor: '#3b82f6',
    primaryTextColor: '#f1f5f9',
    secondaryColor: '#1e293b',
    tertiaryColor: '#0f172a',
    lineColor: '#64748b',
    textColor: '#cbd5e1',
    clusterBkg: '#0b1222',
    clusterBorder: '#334155',
    edgeLabelBackground: '#0f172a',
    actorBkg: '#172554',
    actorBorder: '#3b82f6',
    signalColor: '#94a3b8',
    noteBkgColor: '#2a1e05',
    noteBorderColor: '#b45309',
    noteTextColor: '#fde68a',
    actorTextColor: '#f1f5f9',
    sequenceNumberColor: '#0f172a',
  },
}

async function render() {
  if (!import.meta.client || !container.value) return
  const run = ++renderCount
  try {
    const { default: mermaid } = await import('mermaid')
    const dark = colorMode.value === 'dark'
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      darkMode: dark,
      fontFamily: getComputedStyle(container.value).fontFamily,
      themeVariables: { ...palettes[dark ? 'dark' : 'light'], fontSize: '14px' },
      flowchart: { curve: 'basis', padding: 14, nodeSpacing: 36, rankSpacing: 46, htmlLabels: true, wrappingWidth: 260 },
      sequence: { mirrorActors: false, boxMargin: 8, actorMargin: 60 },
    })
    const result = await mermaid.render(`mermaid-${uid}-${run}`, props.code.trim())
    if (run !== renderCount) return
    svg.value = result.svg
    error.value = ''
  }
  catch (e) {
    if (run !== renderCount) return
    error.value = e instanceof Error ? e.message : String(e)
    showSource.value = true
  }
}

onMounted(render)
watch(() => [colorMode.value, props.code], render)
</script>

<template>
  <figure class="ls-mermaid not-prose">
    <div class="ls-mermaid__bar">
      <span class="ls-mermaid__label">
        <UIcon name="i-lucide-workflow" />
        Diagram
      </span>
      <div class="ls-mermaid__actions">
        <UButton
          size="xs"
          color="neutral"
          variant="ghost"
          :icon="showSource ? 'i-lucide-eye' : 'i-lucide-code'"
          :label="showSource ? 'Diagram' : 'Source'"
          :disabled="!!error"
          @click="showSource = !showSource"
        />
        <UButton
          size="xs"
          color="neutral"
          variant="ghost"
          icon="i-lucide-maximize-2"
          aria-label="Open diagram full screen"
          :disabled="!svg"
          @click="expanded = true"
        />
      </div>
    </div>

    <div
      ref="container"
      class="ls-mermaid__canvas"
    >
      <!-- The diagram source stays readable before (or without) JavaScript. -->
      <pre
        v-if="showSource || !svg"
        class="ls-mermaid__source"
        :class="{ 'is-pending': !svg && !showSource }"
      ><code>{{ code.trim() }}</code></pre>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div
        v-else
        class="ls-mermaid__svg"
        v-html="svg"
      />
      <p
        v-if="error"
        class="ls-mermaid__error"
      >
        Couldn't draw this diagram: {{ error }}
      </p>
    </div>

    <figcaption
      v-if="caption"
      class="ls-mermaid__caption"
    >
      {{ caption }}
    </figcaption>

    <UModal
      v-model:open="expanded"
      :title="caption || 'Diagram'"
      fullscreen
    >
      <template #body>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div
          class="ls-mermaid__svg ls-mermaid__svg--full"
          v-html="svg"
        />
      </template>
    </UModal>
  </figure>
</template>

<style scoped>
.ls-mermaid {
  margin: 1.5rem 0;
  border: 1px solid var(--ui-border);
  border-radius: calc(var(--ui-radius) * 2);
  background:
    radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--ui-text-highlighted) 9%, transparent) 1px, transparent 0) 0 0 / 18px 18px,
    var(--ui-bg);
  overflow: hidden;
}

.ls-mermaid__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.375rem 0.25rem 0.875rem;
  border-bottom: 1px solid var(--ui-border);
  background: color-mix(in oklab, var(--ui-bg-elevated) 60%, var(--ui-bg));
}

.ls-mermaid__label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}

.ls-mermaid__actions {
  display: flex;
  gap: 0.125rem;
}

.ls-mermaid__canvas {
  padding: 1.25rem;
  overflow-x: auto;
}

.ls-mermaid__source {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.6;
  white-space: pre;
  color: var(--ui-text-muted);
}

.ls-mermaid__source.is-pending {
  animation: ls-mermaid-pulse 1.6s ease-in-out infinite;
}

.ls-mermaid__svg {
  display: flex;
  justify-content: center;
}

.ls-mermaid__svg :deep(svg) {
  height: auto;
  max-width: 100%;
}

.ls-mermaid__svg--full {
  min-height: 100%;
  align-items: center;
}

.ls-mermaid__svg--full :deep(svg) {
  max-width: min(100%, 1400px) !important;
  width: 100%;
}

.ls-mermaid__error {
  margin: 0.75rem 0 0;
  font-size: 0.8125rem;
  color: var(--ui-error);
}

.ls-mermaid__caption {
  padding: 0.625rem 1rem;
  border-top: 1px solid var(--ui-border);
  font-size: 0.875rem;
  color: var(--ui-text-muted);
  text-align: center;
}

@keyframes ls-mermaid-pulse {
  50% { opacity: 0.5; }
}
</style>
