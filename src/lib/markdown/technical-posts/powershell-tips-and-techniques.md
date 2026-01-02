---
title: PowerShell tXips and techniques
description: PowerShell tXips and techniques
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - powershell
---
Copy current path to the clipboard

```
(pwd).Path | set-clipboard
```

### edit the PowerShell profile with VS Code

```
code $profile
```

### Reload PowerShell after changing the PS profile

```
. $profile
```

### Edit the PowerShell profile

```
notepad $profile
```

### My functions

| Name | Description              |
| ---- | ------------------------ |
| rund | Run `pnpm run dev`       |
| runc | Start PostCSS            |
| dlr  | Start downloads registry |

powershell.exe -noexit -command Set-Location -literalPath '%V'

C:\Program Files\PowerShell\7\pwsh.exe"

Computer\HKEY_CLASSES_ROOT\Directory\Background\shell\Powershell\command

## Get a directory listing of files with specific extensions

```
get-childitem *.* -r | where {$_.extension -in (".png", ".afdesign", ".webp")} | select-object -property fullname
```

Longer form:

```
$folder = Get-ChildItem C:\test\test1\
$wildcards = @(".txt",".doc",".xls")
$files = Get-ChildItem -Path $folderPath | where {$_.extension -in $wildcards}
$files
```

Get all image files

```
get-childitem d:\luther-backup\*.* -r
  | where {$_.extension -in (".png", ".afdesign", ".svg", ".webp")}
  | select-object -property fullname
  > luther-backup-image-assets.txt
```

Get a list of image-related files separated by the pipe character.

> [!info]
> The line continuation character for PowerShell is the tilde

```
get-childitem d:\luther-backup\*.* -r `
     | where {$_.extension -in (".png", ".afdesign", ".svg", ".webp")} `
     | select-object name, fullname `
     | export-csv -path test.txt -delimiter '|'
```

Get all \*.vrproj and \*.vrm files.

```
get-childitem d:\luther-backup\*.* -r
  | where {$_.extension -in (".vrproj", ".vrm")}
  | select-object name, lastwritetime, fullname
  | export-csv -path avr-projects.txt
```

```
get-childitem c:\users\thumb\documents\*.* -r
	| Where-Object { $_.FullName -notlike '*\node_modules\*' }
	| where {$_.extension -in (".png", ".afdesign", ".svg", ".webp")}
	| select-object name, fullname
	| export-csv -path c:\users\thumb\documents\image-vault.txt -delimiter '|'
```

```
$f = get-childitem c:\users\thumb\documents\ -r |  Where-Object { $_.FullName -notlike '*\node_modules\*' } | where {$_.extension -in (".png", ".afdesign", ".svg", ".webp")} |select-object name, fullname | export-csv -path test.txt -delimiter '|'
```

The `force` flag is important to avoid security restriction issues.

```
get-childitem "H:\jerrybutler-disk" -r -force  where {$_.extension -in (".vr", ".ashx.vr", ".ashx")}  select-object -property fullname export-csv -path test.txt -delimiter '|'
```

## To get selected properties

```
blah blah | select-object pname1,pname2
```

where the default property is -property

## Pause for keypress after doing something

```
param (
	[Parameter(Mandatory)][string] $date
)

write-host Hello today is $date

cmd /c pause
```


### To get a list of file extensions output to a CSV file:

```
get-childitem *.bak -r `
   | select-object fullname, lastwritetime `
   | export-csv -path .\delray.bak.csv
```

Note: CSV output avoid concatenating property names.

### Mount and Unmount VHDX

```
Mount-DiskImage -ImagePath "C:\path\to\your\file.vhdx"
```

```
Dismount-DiskImage -ImagePath "C:\path\to\your\file.vhdx"
```

### Disable "Running Scripts is Disabled on this System"

```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Backup all SQL Server databases

This script backs up all SQL databases and copies the .bak files.

```
get-sqldatabase -serverinstance . |
    where { $_.Name -ne 'tempdb' } |
    backup-sqldatabase

$source_path = "C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\Backup\*.bak"

$target_path = ""C:\Users\thumb\Documents\sql-server-backup""

copy-item $source_path -destination $target_path
```

### Show object properties

```
get-childitem test2.ps1 | Get-Member -MemberType Properties
```

### Untested routines to write to a given point on the terminal

```
function Write-To-Pos {
    param(
        [string]$str,
        [int]$x = 0,
        [int]$y = 0,
        [consolecolor]$backgroundColor = $Host.UI.RawUI.BackgroundColor,
        [consolecolor]$foregroundColor = $Host.UI.RawUI.ForegroundColor
    )

    $oldPos = $Host.UI.RawUI.CursorPosition
    $newPos = $oldPos
    $newPos.X = $x
    $newPos.Y = $y
    $Host.UI.RawUI.CursorPosition = $newPos
    $Host.UI.RawUI.BackgroundColor = $backgroundColor
    $Host.UI.RawUI.ForegroundColor = $foregroundColor
    Write-Host $str -NoNewline
    $Host.UI.RawUI.CursorPosition = $oldPos
}
```

```
function Write-To-Pos {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string] $Text,
        [Parameter(Mandatory=$true)]
        [int] $X,
        [Parameter(Mandatory=$true)]
        [int] $Y,
        [ConsoleColor] $ForegroundColor = "White",
        [ConsoleColor] $BackgroundColor = "Black"
    )

    $oldForegroundColor = $Host.UI.RawUI.ForegroundColor
    $oldBackgroundColor = $Host.UI.RawUI.BackgroundColor

    $Host.UI.RawUI.ForegroundColor = $ForegroundColor
    $Host.UI.RawUI.BackgroundColor = $BackgroundColor

    [Console]::SetCursorPosition($X, $Y)
    [Console]::Write($Text)

    $Host.UI.RawUI.ForegroundColor = $oldForegroundColor
    $Host.UI.RawUI.BackgroundColor = $oldBackgroundColor
}
```