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
    // Icons used only in .navigation.yml files aren't detected automatically.
    clientBundle: {
      icons: ['lucide:book-open'],
    },
  },
})
