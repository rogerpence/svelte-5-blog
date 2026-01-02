---
title: Luther 2.0 backup docs (using the term loosely)
description: Luther 2.0 backup docs (using the term loosely)
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - utilities
---
The PowerShell script to run the backup is here:

```
"C:\Users\thumb\Documents\Projects\general-utilities\luther-backup.ps1"
```

```
.\mount-all.ps1

get-sqldatabase -serverinstance DelRay | where { $_.Name -ne 'tempdb' } | backup-sqldatabase

push-location -path .
set-location -path "C:\Users\thumb\Documents\Projects\cs\cs-misc\LutherBackup\LutherBackup\bin\Debug\net6.0\"
.\LutherBackup.exe run-backup --device *all
pop-location
.\dismount-all.ps1

cmd /c pause
```

## C# LutherBackup program

```
C:\Users\thumb\Documents\Projects\cs\cs-misc\LutherBackup
```

`appsettings.json` as of 26 Oct 2023

```
{
  "Config": {
    "RoboCopyArgs": "/mt:64 /mir /v /nfl",
    "RoboCopyExcludeFiles": "/xf NTUSER.DAT* ntuser.ini *.gm2 *.gbp *.pst *.vhdx .dmp",
    "RoboCopyExcludeFolders": "/xd node_modules AppData dat env site-packages .git Dropbox",
    "RoboCopyLogArg":  "/log:"
  },
  "BackupDriveInfo": [
    {
      "DriveName": "rpwin10git",
      "SourceDirectory": [
        "users\\roger\\documents"
      ],
      "TargetDevice": [
        "seagate-4tb-desktop",
        "seagate-4tb-little"
      ]
    },
    {
      "DriveName": "win10rp-1809",
      "SourceDirectory": [
        "c:\\users\\roger\\documents",
        "c:\\utilities",
        "c:\\users\\roger\\downloads",
        "C:\\Program Files\\Microsoft SQL Server\\MSSQL14.MSSQLSERVER\\MSSQL\\Backup"
      ],
      "TargetDevice": [
        "seagate-4tb-little",
        "seagate-4tb-desktop"
      ]
    },
    {
      "DriveName": "delray",
      "SourceDirectory": [
        "users\\thumb\\documents",
        "users\\thumb\\zotero"
      ],
      "TargetDevice": [
        "seagate-4tb-little",
        "seagate-4tb-desktop"
      ]
    },
    {
      "DriveName": "win-11-01",
      "SourceDirectory": [
        "users\\thumb\\documents"
      ],
      "TargetDevice": [
        "seagate-4tb-desktop",
        "seagate-4tb-little"
      ]
    }
  ]
}
```