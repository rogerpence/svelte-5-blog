---
title: Monitoring Wings and Mobile RPG end-user licensing
description: This article shows how to determine how many Wings/Mobile RPG licenses you currently have and how many licenses are currently active.
tags:
  - licensing
  - mobile-rpg
  - wings
date_published: '2023-12-28T22:09:39.000Z'
date_updated: '2023-12-28T22:09:39.000Z'
date_created: '2023-12-28T22:09:39.000Z'
pinned: false
---

ASNA Wings and ASNA Mobile are licensed per end-user on your IBM i server. Your license can be either an unlimited site license or licensed to a specific number of users (sold in blocks of 5, 10, 15, 20, 50, 100, 200 users, etc). This article is primarily for those customers licensed with a fixed number of users. It shows how to determine how many licenses you currently have and how many licenses are currently active.

To see your Wings or Mobile RPG license information, use the           `
               DSPRRR
          `           (Display Registrar) command. This command is in your DataGate library. For example, if you're using the default DataGate library for DataGate 16.x on the IBM i, use:

```
DG8_160/DSPRRR
```
This displays the initial DSPRRR screen as shown below in Figure 1a.

![downloads/images/DSPRRR-01.png](https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/DSPRRR-01.png)

Figure 1a. DSPRRR's initial screen.

There are four license types you can check:

- WINGS (\*WINGS) - for Wings only

- Mobile RPG (\*MOBILERPG) - for Mobile RPG

- Wings Extended (\*WINGSEXT) - for Wings and Mobile RPG

- BTerm (\*BTERM) - for Browser Terminal

After selecting a license type, press enter to see your current license status (this screen shows Wings licenses) as shown below in Figure 1b.

![downloads/images/DSPRRR-01.png](https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/DSPRRR-02.png)

Figure 1b. Wings licensing info.

The output includes a header with the product name, the seat count with the applied license, the currently used seats and the total number of jobs. For each seat, the corresponding jobs are listed with the following information per job listed:

- Job Id (Job name/User/Number)
- Timestamp when license was granted
- Handler license version
- Web Server information

    - Server computer name
    - Application path
    - ASP.NET Session ID
- User browser information

    - Computer IP address
    - Computer name (if known by IIS)
    - User Agent string

## Calculating user seats

**Wings Seats**

For Wings users with either \*WINGS or \*WINGSEXT licenses, one or more Wings browser sessions from the same IBM i user from a single desktop browser type (ie, Chrome, Edge, or FF) counts as one Wings user license.

**Mobile RPG Seats**

For Mobile RPG users with a \*MOBILERPG license, each Mobile RPG browser session from the same mobile device (phone or table) from a single browser type (ie, Chrome, Edge, or FF) counts as one \*MOBILERPG user license.

For Mobile RPG users with a \*WINGSEXT license, multiple Mobile RPG browser sessions from the same mobile device (phone or table) from a single browser type (ie, ASNA Go, Chrome, Edge, or FF) counts as one \*MOBILERPG user license.

**Browser Terminal seats**

Browser Terminal user licenses are counted just like Wings seats.

## Licensing note for developers

While developing Wings or Mobile RPG applications, it's possible to leave an orphan IIS Express session dangling when you end a debugging session. For that reason, we recommend you end debugging sessions with Visual Studio's "Terminate all" command instead of ending the debugging session. Ending a debugging session with "Terminate all" ensures no dangling IIS sessions.           [See this article for more information on "Terminate all."]

If you mysteriously run out of licenses during a Wings or Mobile RPG development session, using           `
               DSPRRR
          `           as described above can confirm you're leaving orphan jobs on the IBM i during debuggging.