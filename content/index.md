---
seo:
  title: Libreng Sakay Developer Docs
  description: How the Libreng Sakay system works, for the developers taking it over.
---

<!-- The landing page is built from the components in app/components/content/Landing*.vue.
     Text, links and steps are set here; layout and animation live in the components. -->

::landing-hero
---
badge: Province of Bataan · Free bus service
badgeTo: /getting-started/introduction
highlight: Libreng Sakay
title: Developer Docs
description: How Bataan's free bus system fits together, from the admin web app to the driver app and the bus kiosk. Written for the developers taking over the project.
links:
  - label: Start here
    to: /getting-started/introduction
    icon: i-lucide-arrow-right
    primary: true
  - label: See the full flow
    to: /getting-started/how-it-works
    icon: i-lucide-route
pieces:
  - label: Admin web app
    icon: i-lucide-layout-dashboard
  - label: Driver app
    icon: i-lucide-smartphone
  - label: Bus kiosk
    icon: i-lucide-nfc
  - label: One API
    icon: i-lucide-plug
---
::

::landing-marquee
---
label: Built with
items:
  - label: Laravel
    icon: i-simple-icons-laravel
  - label: Vue
    icon: i-simple-icons-vuedotjs
  - label: Inertia
    icon: i-simple-icons-inertia
  - label: Kotlin
    icon: i-simple-icons-kotlin
  - label: Jetpack Compose
    icon: i-simple-icons-jetpackcompose
  - label: Android
    icon: i-simple-icons-android
  - label: MapLibre
    icon: i-simple-icons-maplibre
  - label: OpenStreetMap
    icon: i-simple-icons-openstreetmap
  - label: Pusher protocol
    icon: i-simple-icons-pusher
  - label: Firebase
    icon: i-simple-icons-firebase
---
::

::landing-flow
---
eyebrow: The system
title: Three apps. One API.
description: The web app is the centre of everything. It holds the database, serves the admin dashboard and the passenger tracker, and provides the API both Android apps talk to.
---
::

::landing-timeline
---
eyebrow: How it works
title: One day on the route
description: Follow one bus through one day. Each stop names the part of the system involved, so you know where to look in the code.
steps:
  - time: Before the day
    part: admin
    title: Add buses, drivers and routes
    text: Set up once in the web dashboard and updated when things change. Each route has its stops.
    to: /admin/setting-up-service
  - time: Publish
    part: admin
    title: Publish the schedule
    text: A draft does nothing. Publishing creates one shift per day for the next 7 days, and a job tops it up every night at 00:30.
    to: /admin/setting-up-service
  - time: Once per bus
    part: kiosk
    title: Link a kiosk to the bus
    text: The dashboard gives a one-time enrollment code. Typed into the kiosk (or boarding mode), it ties the kiosk to that bus.
    to: /admin/kiosk-setup
  - time: Start
    part: driver
    title: Hold “Start trip”
    text: The server checks the rules first. The one that fails most often is that the bus's kiosk must have checked in within the last 3 minutes.
    to: /driver-app/running-a-trip
  - time: Boarding
    part: kiosk
    title: Passengers tap in
    text: Card or QR code, checked with Bataeño Pass. Green means welcome aboard. The tap is saved on the phone first, then uploaded.
    to: /kiosk/tapping-in
  - time: On the road
    part: driver
    title: GPS, stops and SOS
    text: Position every 5 seconds while moving. Depart and Arrive at each stop feed arrival estimates, and an SOS shows on the live map at once.
    to: /driver-app/running-a-trip
  - time: Last stop
    part: driver
    title: Hold “End trip”
    text: The trip closes and anyone still on board is marked off the bus. The driver can start the return leg or end the shift.
    to: /driver-app/running-a-trip
  - time: 01:00
    part: server
    title: Reports, built overnight
    text: The day's boardings are added up into report tables. Around 01:30 the server also learns travel times to improve arrival estimates.
    to: /getting-started/how-it-works
---
::

::landing-showcase
---
eyebrow: Live monitoring
title: Every bus, live, on one map
description: Dispatch sees positions, passenger counts, SOS alerts and problem reports the moment they happen, pushed over Reverb, Laravel's WebSocket server.
image: /images/admin/13-live-map.webp
url: libresakay · admin · live-monitoring
callouts:
  - icon: i-lucide-navigation
    title: GPS every 5 seconds
    text: Every 60 seconds while the bus is parked.
  - icon: i-lucide-siren
    title: SOS on the map at once
    text: Problem reports show up the same way.
  - icon: i-lucide-wifi-off
    title: Works without signal
    text: GPS points and taps are kept and sent later.
stats:
  - value: 3
    label: Apps that make up the system
  - value: 5
    suffix: s
    label: Between GPS updates while moving
  - value: 7
    suffix: days
    label: Of shifts created ahead on publish
  - value: 0
    suffix: fares
    label: No money anywhere in the system
---
::

::landing-bento
---
eyebrow: Explore the docs
title: Pick up where you'll be working
description: Start with how it works, then read the section for the part you'll be taking over.
items:
  - title: How it works
    description: One day in the system, from publishing a schedule to the morning report. Read this first.
    to: /getting-started/how-it-works
    icon: i-lucide-route
    visual: route
    span: 2
  - title: Admin
    description: The web dashboard where staff set up buses, routes and schedules and watch trips live.
    to: /admin/overview
    icon: i-lucide-layout-dashboard
    visual: dashboard
  - title: Driver app
    description: The Android app drivers use to start trips, mark stops and talk to dispatch.
    to: /driver-app/overview
    icon: i-lucide-smartphone
    visual: phone
  - title: Kiosk
    description: How passengers tap in, and how each tap is counted, even without signal.
    to: /kiosk/overview
    icon: i-lucide-nfc
    visual: nfc
  - title: Roles
    description: Who can open what, and how access is given.
    to: /getting-started/roles
    icon: i-lucide-users
    visual: roles
  - title: API
    description: The endpoints the two Android apps call, how they sign in, and the live update channels.
    to: /api/overview
    icon: i-lucide-plug
    visual: api
    span: 3
---
::

::landing-cta
---
title: Ready to take the wheel?
description: Start with the introduction, then follow one bus through a full day.
links:
  - label: Read the introduction
    to: /getting-started/introduction
    icon: i-lucide-arrow-right
    primary: true
  - label: How it works
    to: /getting-started/how-it-works
    icon: i-lucide-route
---
::
