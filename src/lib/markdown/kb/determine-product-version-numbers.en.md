---
title: How to determine ASNA product versions
description: How to get ASNA product version and build numbers for Windows and IBM i products.
tags:
  - datagate-ibm-i
  - datagate-sql-server
  - licensing
  - mobile-rpg
  - monarch
  - synon-escape
  - visual-rpg
  - wings
date_published: '2024-01-04T14:59:52.000Z'
date_updated: '2024-01-04T21:01:34.000Z'
date_created: '2024-01-04T21:01:34.000Z'
pinned: false
---

When you report an issue to ASNA tech support, or when you need a new or updated product license key, we'll usually need to know your exact product version(s).

## Windows-based products

Visual Studio has an "about" that shows some license information, but the ASNA licensing information that that dialog shows isn't detailed enough.

The best way to see what versions of ASNA software you have installed is to use Windows "Programs and Features" list launched from the Windows Control Panel (on either a desktop PC or a Windows server). That displays a list like the one shown below:

![Windows programs and features](https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/asna-programs-features.png)

Product names are shown in the "Name" column and the version number we need is in the "Version" column.

It's important to launch "Programs and Features" from the Control Panel to see this information. There are many ways to launch this applet:

- Press Windows-X, and select "Programs and Features" at the top of the list
- Press Windows-R (to launch the run command line window) and type `appwiz.cpl`
- Open the Control Panel, select Programs, and then select Programs and Features

## DataGate on the IBM i

[This article shows how to determine what version of DataGate you're running on your IBM i.](/en/kb/get-datagate-library-name)

