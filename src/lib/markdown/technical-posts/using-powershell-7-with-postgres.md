---
title: Using PowerShell 7 with Postgres
description: Using PowerShell 7 with Postgres
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - powershell
  - postgres
---
Run this from an admin terminal

```
Install-Package -Name Microsoft.Extensions.Logging.Abstractions -ProviderName NuGet -Scope CurrentUser -RequiredVersion 8.0.0 -SkipDependencies -Destination . -Force

Install-Package -Name Npgsql -ProviderName NuGet -Scope CurrentUser -RequiredVersion 8.0.1 -SkipDependencies -Destination . -Force
```