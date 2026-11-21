// Public URL of the docs, used for the sitemap and page metadata.
// Set NUXT_SITE_URL when deploying. On Vercel the production domain is picked up automatically.
const siteUrl = process.env.NUXT_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')

export default defineNuxtConfig({
  extends: ['docus'],
  site: {
    name: 'Libreng Sakay Docs',
    url: siteUrl,
  },
  icon: {
    // Use the installed icon sets instead of fetching icons online at build time.
    serverBundle: 'local',
    // Icons used only in .navigation.yml files or in the landing page's component props
    // (content/index.md) aren't detected automatically.
    clientBundle: {
      icons: [
        'lucide:book-open',
        'lucide:arrow-right',
        'lucide:route',
        'lucide:layout-dashboard',
        'lucide:smartphone',
        'lucide:nfc',
        'lucide:plug',
        'lucide:users',
        'lucide:navigation',
        'lucide:siren',
        'lucide:wifi-off',
        'simple-icons:laravel',
        'simple-icons:vuedotjs',
        'simple-icons:inertia',
        'simple-icons:kotlin',
        'simple-icons:jetpackcompose',
        'simple-icons:android',
        'simple-icons:maplibre',
        'simple-icons:openstreetmap',
        'simple-icons:pusher',
        'simple-icons:firebase',
      ],
      scan: true,
    },
  },
})
