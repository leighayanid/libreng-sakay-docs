import type { Ref } from 'vue'

/**
 * Fades in every `[data-reveal]` element inside `root` as it scrolls into view.
 * Set `style="--d: 120ms"` on an element to delay it.
 */
export function useReveal(root: Ref<HTMLElement | null>) {
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const el = root.value
    if (!el) return
    const items = el.querySelectorAll<HTMLElement>('[data-reveal]')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(item => item.classList.add('is-in'))
      return
    }
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in')
          observer?.unobserve(entry.target)
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
    items.forEach(item => observer!.observe(item))
    el.classList.add('ls-reveal-armed')
  })

  onBeforeUnmount(() => observer?.disconnect())
}

/** Tracks the pointer over `root` and exposes it as CSS variables (--mx, --my in px; --px, --py from -0.5 to 0.5). */
export function usePointerVars(root: Ref<HTMLElement | null>) {
  let frame = 0
  function onPointerMove(event: PointerEvent) {
    const el = root.value
    if (!el || frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      el.style.setProperty('--mx', `${x}px`)
      el.style.setProperty('--my', `${y}px`)
      el.style.setProperty('--px', (x / rect.width - 0.5).toFixed(3))
      el.style.setProperty('--py', (y / rect.height - 0.5).toFixed(3))
    })
  }
  function onPointerLeave() {
    const el = root.value
    if (!el) return
    el.style.setProperty('--px', '0')
    el.style.setProperty('--py', '0')
  }
  onBeforeUnmount(() => cancelAnimationFrame(frame))
  return { onPointerMove, onPointerLeave }
}
