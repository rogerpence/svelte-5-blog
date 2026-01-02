---
title: Customize Visual Studio to end all processes when debug ends
description: How to customize Visual Studio to end all processes when debug ends.
tags:
  - visual-studio
date_published: '2024-01-09T20:59:40.000Z'
date_updated: '2024-01-10T03:54:37.000Z'
date_created: '2024-01-10T03:54:37.000Z'
pinned: false
---

Visual Studio’s default ending of a debug session is to leave all associated processes running. But, in most cases, it’s better to also end those associated processes when you end debugging. This is especially true with ASNA Wings and Mobile RPG, but even a traditional ASP.NET app can get tripped up by a dangling IIS Express process.

The good news is that this is an easy problem to resolve–using the Debug menu’s Terminate All not only ends Visual Studio’s debugging session but it also ends all associated processes. Once I learned about Terminate All, I never looked back. I always use it to end a debugging session.

![ALT NEEDED](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/devenv_ls77Sjw7DT_70.webp)

Quick access to "Terminal All" isn’t directly available from Visual Studio’s debug tool bar at the top of Visual Studio. However but this GIF shows how to to add "Terminate All" to your debugging toolbar. 

![ALT NEEDED](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/terminate-all.gif)
