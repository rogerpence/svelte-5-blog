---
title: Creating a packaged C# EXE for deployment/publish
description: Creating a packaged C# EXE for deployment/publish
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - csharp
---
With self-contained deployment it should bundle all the .NET FW stuff up--but I've had trouble with that. And it's probably silly if you are going to deploy more than one app on the target PC. I am using the other option below now.
![[cs-profile-settings-for-single-file-deployment.png|497]]

This is a pretty cool option. If the target .NET FW isn't installed on the target PC, you are prompted to install it. This worked well deploying things to Mothra.
![[Creating a packaged Csharp EXE for deployment-1.png|500]]