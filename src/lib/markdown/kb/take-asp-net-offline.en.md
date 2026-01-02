---
title: How to easily take an ASP.NET site offline
description: How to easily take an ASNA Visual RPG ASP.NET site offline.
tags:
  - asp-net
  - mobile-rpg
  - monarch
  - visual-rpg
  - wings
date_published: '2024-01-09T13:28:43.000Z'
date_updated: '2024-01-09T20:03:29.000Z'
date_created: '2024-01-09T20:03:29.000Z'
pinned: false
---

All Websites or Web servers need maintenance from time to time. This article shows a very simple little ASP.NET tip that can easily keep users from accessing your site during maintenance. This is something to consider doing anytime you need to upgrade your ASNA WebPak or DataGate for IBM i, or redeploy your Web app.

To keep users from using your ASP.NET site while you’re doing maintenances or upgrades, all you need to is add an HTML file named `app_offline.htm` in the root of the site. The name is very important–it’s not case sensitive but it must be named exactly as shown (`app-offline.html` won’t work.)

When this file is present, ASP.NET brings the application domain down and shows the contents of the `app_offline.html` file. You can provide any info necessary in that HTML. You can add any HTML content you want to this HTML file. You might want to use something a little more graceful than a picture of Homer Simpson!dd

![Take an ASP.NET application offline](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/app-offline.jpg)

> If any users are active when you add the file to your sites root, those users’ next requests will fail. If they were in the middle of an add or update operation, that process will fail. Be sure to schedule your downtime ahead of time with your end users.

When `app_offline.htm` is shown, the URL shows whatever URL the user requested. When you’re ready to bring the application backup, remove or rename the `app_offline.htm` file. The next user request brings the site back up.

[Read more about taking ASP.NET sites down.](https://learn.microsoft.com/en-us/aspnet/web-forms/overview/deployment/advanced-enterprise-web-deployment/taking-web-applications-offline-with-web-deploy)