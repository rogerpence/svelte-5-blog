---
title: x cool things to do with PowerShell
description: x cool things to do with PowerShell
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - powershell
---
### Initial explanation

-   Be careful! PowerShell is very powerful. It is the table saw of Windows features. In can you amazing things for you but it can also hurt you!
-   Explain Terminal and Starship CLI
-   Explain PowerShell relation to DOS commands and batch files\*
    -   DOS Aliases
-   Execution policy

### Things to research

-   Get installed ASNA products from registry

```
ls HKLM:software\ASNA\Installinfo -recurse -depth 2
 | out-file -path 'asna-products.txt.
```

-   Get-Help, Update-Help, Get-Member, Get-Command
-   Get-History and Out-File

```
get-history | out-file -path 'ps-history.txt'
```

-   Push/Pop and Set-Location
-   ISE
-   Debugging
-   Compare files
-   Scan for open ports
-   Work with services
-   Tee object

### Things you can do

-   Backup SQL Server
-   Find and kill a process
-   Put a file on the clipboard
-   Recuse folders
-   Get list of big files
-   Export to CSV and HTML
-   Add functions to your PowerShell $profile