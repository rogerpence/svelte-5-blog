---
title: How to use Resilio to keep folders synced
description: How to use Resilio to keep folders synced
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - utilities
  - obsidian
---
To add a client to Resilio, you need to copy in the key from the machine with the source folder. Do not add the folder on the client.

-   Always keep selective sync turned off.
-   For me, the Envoy VM is the host computer. My powerderfinger and mothra devices are peers to that box.
-   my Resilio key is in my Google Drive ("Resilio Sync.btskey")

On the host:

-   Create a shared folder
-   Get its key by clicking the Share button
    ![[Resilio folder syncing.png|500]]

On the client:

-   Click plus sign
-   Use "Enter key or link" option
-   You'll be prompted for a target folder
    -   This folder should be empty
    -   The shared folder will be immediately copied from the host