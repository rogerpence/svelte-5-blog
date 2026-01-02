---
title: Launch Chrome with PowerShell
description: Launch Chrome with PowerShell
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - powershell
---
```
start-process "chrome" "file:C:\Users\thumb\Documents\myfile.html"
```

You can also use the `-nonewindow` argument to keep from opening a dangling terminal window. However, you'll probably need to use a fully-qualified executable name with that.

```
start-process -filepath "C:\Program Files\Google\Chrome\Application\chrome.exe"
              -argumentlist "C:\Users\thumb\Documents\myfile.html"
              -NoNewWindow
```

You can omit the `-filename` and `argumentlist` arguments.

or use `msedge` to load MS Edge.

These examples show loading a local file but you can also provide a URL.

### Launch a browser for a dev url

I wanted to load a Sveltekit dev URL in the browser for development. I tried this and it didn't work.

```
pnpm run dev
start-process "msedge" "http://localhost:5188/release-sets"
```

While it's not intuitive, reversing the order of the commands does work:

```
start-process "msedge" "http://localhost:5188/release-sets"
pnpm run dev
```

This launches the browser local URL and throws an immediate 404. However as soon as the dev environment finishing spinning up the page requested is loaded.

### Closing the terminal

In some cases, you might need to use this to close the terminal.

```
$host.SetShouldExit(0)
```