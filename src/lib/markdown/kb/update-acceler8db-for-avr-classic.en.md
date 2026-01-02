---
title: Upgrading the ASNA Acceler8 local database for AVR Classic
description: This article shows how to upgrade the ASNA Acceler8 local database. This task is usually done for AVR Classic prior to upgrading AVR Classic--but it also applies to ASNA Visual RPG for .NET.
tags:
  - datagate
  - visual-rpg
date_updated: '2024-06-24T00:00:00.000Z'
date_published: '2024-06-24T00:00:00.000Z'
date_created: '2024-06-24T00:00:00.000Z'
pinned: false
---
<script>
    import Image from '$components/text-decorators/Image.svelte';
</script>
When you want to upgrade your ASNA Visual RPG 4.x or AVR 5.0 environments, when you're using the DataGate Acceler8 local database, it's a good idea to first upgrade that the Acceler8 local DB first--and then test your existing 4.x or 5.0 apps with that database. When you've confirmed all is well, then you can upgrade the dev and production environments. 

> Your AVR 4.x and 5.0 applications will work with the upgraded Acceler8 database without change. In this article, we'll focus on upgrading ADB 11x to ADB 17x, but the steps taken apply to any version. 

To upgrade an older version of Acceler8 local database is easy but the product download you need isn't very intuitive. The download you need is the ASNA Visual RPG for .NET Framework Windows Deployment 17.0.30.0 (or whatever build number is currently showing for AVR for .NET 17.) [This file is available at here.](https://www.asna.com/downloads/en)

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/images/asna-com/adb-11-to-adb-17-download.webp" alt="Download AVR for .NET Framework 17.0.30.0 Windows deployment" width="500" alignment="center" caption="Figure 1."/>

This download contains the bits to upgrade ADB to ADB 17. Before you run the download installer EXE file, be sure that no users are currently using your database. This is very important. Any active users could lose data if you attempt to perform this upgrade while they are using the database.

When you sure there no database users active, all you need to do is run the installer EXE file. This install will stop and remove the previous instance of ADB and install, and start, ADB 17. When the install finishes, the upgrade is complete. 

[Watch a YouTube video that shows this upgrade in action.](https://www.youtube.com/watch?v=Y1qQWED1UUA&t=3s&pp=ygUOYXNuYSAgZGF0YWJhc2U%3D)