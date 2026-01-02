---
title: Backup SQL Server with PowerShell
description: Backup SQL Server with PowerShell
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - utilities
  - powershell
---
See also: [[PowerShell tips and techniques]]

```


get-sqldatabase -serverinstance thumb-vm
  | where { $_.Name -ne 'tempdb' }
  | backup-sqldatabase

copy-item "C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\Backup\*.bak" -destination "c:\users\thumb\documents\sql-server-backup"
```