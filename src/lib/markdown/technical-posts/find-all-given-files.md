---
title: Find all given files
description: Find all given files
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - powershell
---
```
Get-ChildItem -Path "E:\luther-backup\win10rp-1809\users\roger\documents\Programming\*.*" -recurse | Where-Object {$_.Extension -in ".vr", ".cs"} | select fullname | Out-File "C:\Output.txt" -Encoding UTF8
```

```
Get-ChildItem -Path "E:\*.*" -recurse | Where-Object {$_.Extension -in ".vr", ".cs"} | select fullname | Out-File "e:\all-folders.txt" -Encoding UTF8
```

```
Get-ChildItem -Path "E:\*.*" -recurse | `
          Where-Object {$_.Extension -in ".vr", ".cs", ".sln"} | `
          ForEach-Object { [PSCustomObject]@{ FileName = $_.Name; FullName = $_.FullName } } | `
          Export-Csv -Path "e:\file_list.csv" -NoTypeInformation -delimiter "|"
```

```
Get-ChildItem -Path ".\*.*" -recurse | `
        Where-Object {$_.Extension -in ".vr", ".dll", ".sln", ".aspx", ".asmx", ".ashx", "*.master"} | `
        ForEach-Object { [PSCustomObject]@{ FileName = $_.Name; FullName = $_.FullName; LastWriteLtime = $_.LastWriteTime } } | `
        Export-Csv -Path ".\file_list.csv" -NoTypeInformation -delimiter ","
```

```
 Get-ChildItem -Path "L:\*.*" -recurse | `
           Where-Object {$_.Extension -in ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg" | `
           ForEach-Object { [PSCustomObject]@{ FileName = $_.Name; FullName = $_.FullName } } | `
           Export-Csv -Path "c:\users\thumb\documents\do-images.csv" -NoTypeInformation -delimiter ","
```

Here is another way to get a list of files with PowerShell

```
get-childitem *.md -recurse | select-object lastwritetime, fullname | sort-object -property lastwritetime -descending
```

I moved these projects from AVR to CS

```
Directory: C:\Users\thumb\Documents\projects\avr\export-sql-query-to-csv
Directory: C:\Users\thumb\Documents\projects\avr\ImportCSV
Directory: C:\Users\thumb\Documents\projects\avr\read-dynamics-account-excel
Directory: C:\Users\thumb\Documents\projects\avr\export-sql-query-to-csv
```