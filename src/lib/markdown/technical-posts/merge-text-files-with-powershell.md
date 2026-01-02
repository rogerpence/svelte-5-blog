---
title: Merge text files with PowerShell
description: Merge text files with PowerShell
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - powershell
---
This PowerShell script merges "include" files into the main file.

mainfile.txt

```
This is line 1.

#include otherfile.txt

This is line 2.
```

otherfile.txt

```
This is text from the other file
```

output

```
This is line 1.

This is text from the other file

This is line 2.
```

PowerShell script

(This script has a hardwired output file directory.)

```powershell
param (
    [Parameter(Mandatory)][string] $input_file
)

$global:linesCollection = @()

function read-file {
    param (
        [string] $input_file
    )

    # Check if the file exists
    if (Test-Path $input_file) {
        write-host reading
        # Read the file line by line
        Get-Content -Path $input_file | ForEach-Object {
            # Process each line
            $line = $_

            if ($line -match '^\s*#include') {
                $include_file = ($line -replace '^\s*#include', '').trim()
                Write-Host $include_file -ForegroundColor yellow
                read-file -input_file $include_file
            }
            else {
                # Add the line to the collection
                $global:linesCollection += $line
            }
        }
    } else {
        Write-Output "File not found at: $input_file"
        [Environment]::Exit(1)
    }
}

push-location

set-location ..\release-notes-base-templates

$files = get-childitem *.md

foreach ($file in $files) {
    read-file -input_file $file.Name
    $stringArray = [string[]]$linesCollection
    $stringArray | Set-Content -Path "..\tester\$($file.name)"
    $global:linesCollection = @()
}

pop-location
```