---
seo:
  title: Libreng Sakay Developer Docs
  description: How the Libreng Sakay system works, for the developers taking it over.
---

::u-page-hero
#title
Libreng Sakay Developer Docs

#description
How Bataan's free bus system fits together: the admin web app, the driver app, and the bus kiosk. Written for the developers taking over the project.

#links
  :::u-button
  ---
  to: /getting-started/introduction
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  Start here
  :::

  :::u-button
  ---
  to: /getting-started/how-it-works
  size: xl
  color: neutral
  variant: subtle
  ---
  See the full flow
  :::
::

::u-page-section
  :::u-page-grid
    ::::u-page-card
    ---
    icon: i-lucide-route
    to: /getting-started/how-it-works
    spotlight: true
    ---
    #title
    How it works

    #description
    One day in the system, from publishing a schedule to the morning report.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-layout-dashboard
    to: /admin/overview
    spotlight: true
    ---
    #title
    Admin

    #description
    The web dashboard where staff set up buses, routes and schedules and watch trips live.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-smartphone
    to: /driver-app/overview
    spotlight: true
    ---
    #title
    Driver app

    #description
    The Android app drivers use to start trips, mark stops and talk to dispatch.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-nfc
    to: /kiosk/overview
    spotlight: true
    ---
    #title
    Kiosk

    #description
    How passengers tap in, and how each tap is counted, even without signal.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-plug
    to: /api/overview
    spotlight: true
    ---
    #title
    API

    #description
    The endpoints the two Android apps call, and the live update channels.
    ::::

    ::::u-page-card
    ---
    icon: i-lucide-users
    to: /getting-started/roles
    spotlight: true
    ---
    #title
    Roles

    #description
    Who can open what, and how access is given.
    ::::
  :::
::
