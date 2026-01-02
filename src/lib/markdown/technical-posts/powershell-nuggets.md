---
title: PowerShell nuggets
description: PowerShell nuggets
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - powershell
  - nuggets
---
#### To deploy a PS1

Put the script in this folder (which is in my path):

```
C:\Users\thumb\Documents\rp-utilities
```

#### Show installed versions of .NET Framework

```
Get-ChildItem 'HKLM:\SOFTWARE\Microsoft\NET Framework Setup\NDP' -Recurse | Get-ItemProperty -Name Version,Release -EA 0 | Where { $_.PSChildName -match '^(?!S)\p{L}'} | Select PSChildName, Version, Release
```

#### Counting files in a folder

The @(..) is the array subexpression operator. This ensures that the output of Get-ChildItem is treated as an array, even if it finds zero files or only one file. This is important because single objects don't have a .Count property, but arrays do (even an empty array has a .Count of 0).

```
$is_dg400_present = @(Get-ChildItem -Path $datagate_family_changes_path -Filter "dg400*" -File).Count
```

### Count

#### Backup SQL Server

[[sql-server-backup-with-powershell]]

#### Work with processes

Get processes that start with something (msedge in this case)

```
Get-Process -Name msedge*
```

Stop all processes that start with something:

```
Stop-Process -Name msedge* -force
```