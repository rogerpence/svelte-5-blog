---
title: Creating entity models with Entity Framework
description: Creating entity models with Entity Framework
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - csharp
---
Instructions—these are important

[https://learn.microsoft.com/en-us/ef/core/cli/dotnet](https://learn.microsoft.com/en-us/ef/core/cli/dotnet)

Create DB context

```jsx
C:\Users\thumb\Documents\Projects\cs\cs-misc\create-model-with-ef-core>dotnet ef dbcontext scaffold
"Server=.\;Database=downloads;Trusted_Connection=True;Integrated Security=True;TrustServerCertificate=True"
Microsoft.EntityFrameworkCore.SqlServer
-o Model -n MyNamespace

Also:
-f                   force target files overwrite
--no-pluralize       don't use pluralizer
--use-databasenames  use table and column names exactly as they appear in DB
```

Batch file

This deletes the files in the

```
@echo off
REM %1 = database name
REM %2 = target base folder (under 'baseoutputdir' specified below)
REM %3 = namespace

set baseoutputdir=C:\Users\thumb\Documents\Projects\rputilities\librettox\template_work\output\
set connstring=Server=.\;Database=%1;Trusted_Connection=True;Integrated Security=True;TrustServerCertificate=True

del %baseoutputdir%%2\*.* /q

dotnet ef dbcontext scaffold "%connstring%" Microsoft.EntityFrameworkCore.SqlServer -o %baseoutputdir%%2 -n %3
del model\*context.cs
```