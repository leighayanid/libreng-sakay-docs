# Libreng Sakay Developer Docs

Handover documentation for the Libreng Sakay system: the web app and admin dashboard, the driver app, and the bus kiosk. Built with [Docus](https://docus.dev).

## Run it locally

Needs Node.js 22 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Edit a page

Pages are Markdown files in `content/`. The number at the start of a file or folder name sets its order in the sidebar and isn't part of the URL.

```
content/
  index.md                  Home page
  1.getting-started/        Introduction, How it works, Roles
  2.admin/                  Admin dashboard
  3.driver-app/             Driver app
  4.kiosk/                  Kiosk / boarding mode
  5.api/                    App API
public/images/              Screenshots (from the librengsakay-guide repo)
app/app.config.ts           Site title, colors, GitHub link
app/components/content/     Custom Markdown components (PhoneShots, Landing*)
app/app.css                 Landing page colors and shared animations
```

Docus components such as `::note`, `::warning` and `::steps` are documented at https://docus.dev.

To show phone screenshots side by side with captions:

```md
:phone-shots{:shots='[{"src":"/images/kiosk/06-tap-ok.webp","caption":"Welcome aboard"}]'}
```

## Landing page

`content/index.md` is built from the `Landing*` components in `app/components/content/` (hero, system diagram, timeline, live map, docs grid, closing panel). All the text, links and timeline steps are set in `index.md`; layout and animation live in the components. If you add an icon to `index.md`, also add it to `icon.clientBundle.icons` in `nuxt.config.ts` so it's served locally.

## Deploy

```bash
npm run build      # server build, for Vercel/Netlify/Node
npm run generate   # static site, output in .output/public
```

On Vercel, importing the repository is enough. It detects Nuxt and uses `npm run build`.

## Related repositories

- `libresakay-full` — web app, admin dashboard, passenger tracker, App API
- `libresakay-driver-app` — Android driver app (includes the kiosk as boarding mode)
- `libresakay-android-kiosk` — standalone Android kiosk for the Decard F10-X1 terminal
- `librengsakay-guide` — training slides for end users
