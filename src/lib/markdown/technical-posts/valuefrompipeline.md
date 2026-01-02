---
title: ValueFromPipeline
description: ValueFromPipeline
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - powershell
---
```powershell
param (
    [string]$Title = "File listing."
)

$excludedDirectories = @("debug", "release", "packages", "properties")
$includedExtensions = @(".vr", ".dll", ".sln", ".aspx", ".asmx", ".ashx", "*.master")

$Title = "$Title - $(Get-Date -Format 'yyyy-MM-dd')"


function Should-IncludeFile {
    param (
        [Parameter(Mandatory = $true, ValueFromPipeline = $true)]
        [System.IO.FileSystemInfo]$FileSystemInfo,
        [string[]]$ExcludedDirectories,
        [string[]]$IncludedExtensions
    )

    # Check if it's a directory or a file
    if ($FileSystemInfo -is [System.IO.DirectoryInfo]) {
        #Exclude directories.  Function now only deals with files
        return $false
    }

    # Check Extension
    $includeByExtension = $false  # Default to exclude
    foreach ($FileExtension in $IncludedExtensions) {
        if ($FileSystemInfo.Extension -eq $FileExtension) {
            $includeByExtension = $true # Include if extension matches
            break # Optimization: Exit loop as soon as we find a match
        }
    }

    # Check Directory
    $includeByDirectory = $true  # Default to include
    foreach ($ExcludedDirectory in $ExcludedDirectories) {
        if ($FileSystemInfo.DirectoryName -match $ExcludedDirectory) {
            $includeByDirectory = $false # Exclude if directory matches
            break # Optimization: Exit loop as soon as we find a match
        }
    }

    return $includeByExtension -and $includeByDirectory # Include only if BOTH conditions are true.

}


Get-ChildItem -Path ".\*.*" -recurse -File `
| Where-Object { Should-IncludeFile -FileSystemInfo $_ -IncludedExtensions $includedExtensions -ExcludedDirectories $excludedDirectories } `
| Select-object -property name, extension, directory, fullname, lastwritetime `
| Sort-Object -Property extension, name `
| Export-Excel test.xlsx -title $Title -titlebold -show -clearsheet -autosize -TableName maintable -TableStyle  Medium1

```

# ValueFromPipeline

The `ValueFromPipeline = $true` attribute in the `Should-IncludeFile` function's parameter declaration is crucial for enabling the function to seamlessly integrate with the PowerShell pipeline. Here's a detailed explanation of why it's necessary and what it accomplishes:

**Understanding the PowerShell Pipeline**

The PowerShell pipeline is a series of commands connected by the pipe operator (`|`). Each command in the pipeline receives input from the previous command and passes output to the next command. This allows you to chain together commands to perform complex operations.

**How `ValueFromPipeline = $true` Works**

1. **Automatic Input Binding:** When `ValueFromPipeline = $true` is specified for a parameter, PowerShell automatically attempts to bind the input objects from the pipeline to that parameter. In other words, each object flowing through the pipeline is automatically passed to the function's specified parameter.

2. **Processing Each Object:** The function is executed _once for each object_ that it receives from the pipeline. The `ValueFromPipeline = $true` attribute essentially tells PowerShell to treat the function as if it were being called repeatedly, once for each item in the pipeline. In the `Should-IncludeFile` example, the function will be called once for _every_ `FileSystemInfo` object that `Get-ChildItem` produces.

3. **Accessing the Current Object:** Inside the function, the parameter (`$FileSystemInfo` in this case) will hold the current object from the pipeline. This allows the function to process each file individually.

**Why It's Needed in `Should-IncludeFile`**

-   **Filtering:** The purpose of the `Should-IncludeFile` function is to decide whether to include or exclude a _specific file_ based on certain criteria. To make this decision, the function _must_ receive the `FileSystemInfo` (file or directory) object to examine.

-   **Integration with `Where-Object`:** The `Where-Object` cmdlet uses script blocks (or functions with `ValueFromPipeline = $true`) to filter objects. `Where-Object` calls the script block/function for each object coming through the pipeline. If the function returns `$true`, the object is passed on; if it returns `$false`, the object is filtered out.

-   **Without `ValueFromPipeline = $true`:** If you _didn't_ have `ValueFromPipeline = $true`, the `Where-Object` cmdlet would try to pass the _entire collection_ of `FileSystemInfo` objects to the `Should-IncludeFile` function _at once_. The function would not be able to process each file individually. It would not know how to iterate over all the files, and most likely the program would crash.

**In Summary:**

`ValueFromPipeline = $true` is essential because it tells PowerShell to pass each `FileSystemInfo` object from the `Get-ChildItem` cmdlet through the pipeline _one at a time_ to the `Should-IncludeFile` function. This enables the function to inspect each file individually and determine whether to include or exclude it based on your filtering criteria. Without this attribute, the function would not work correctly within the pipeline.