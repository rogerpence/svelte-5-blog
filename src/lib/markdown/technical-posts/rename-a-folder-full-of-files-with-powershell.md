---
title: Rename a folder full of files with PowerShell
description: Rename a folder full of files with PowerShell
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - powershell
---
Okay, this is a much safer approach as it preserves your original files.

Here's the script that will copy the files with the new names to a subfolder named "newnames":

```powershell
<#
.SYNOPSIS
    Copies files from a specified folder to a "newnames" subfolder,
    renaming them by converting to lowercase and replacing spaces with hyphens.

.DESCRIPTION
    This script iterates through all files (not directories) in a given folder.
    For each file, it:
    1. Converts the entire file name (base name + extension) to lowercase.
    2. Replaces all spaces in the file name (base name + extension) with hyphens (-).
    3. Copies the file to a subfolder named "newnames" (created if it doesn't exist)
       within the original folder, using the new, modified name.

    The script uses -WhatIf by default to show proposed copy operations without
    actually copying or creating the folder. Remove -WhatIf from the
    New-Item and Copy-Item cmdlets to apply changes.

.PARAMETER FolderPath
    The path to the folder containing the files to be processed.
    This parameter is mandatory.

.EXAMPLE
    .\Copy-Rename-Files.ps1 -FolderPath "C:\MyPictures\Vacation 2023"

    This command will process files in "C:\MyPictures\Vacation 2023",
    showing what files would be copied to "C:\MyPictures\Vacation 2023\newnames"
    and how they would be renamed (due to -WhatIf).

.EXAMPLE
    .\Copy-Rename-Files.ps1 -FolderPath "D:\Documents\Reports" -Verbose

    This command will process files in "D:\Documents\Reports", showing
    what copies would occur and providing verbose output for each step.
    To actually copy, edit the script and remove -WhatIf from New-Item and Copy-Item.

.NOTES
    Author: Your Name / AI
    Date:   2023-10-27
    Version: 1.1

    ALWAYS test with -WhatIf first in a sample directory.
    The original files are NOT modified or deleted.
    If a file with the target new name already exists in the "newnames" subfolder,
    that specific file copy will be skipped to prevent overwriting.
#>

[CmdletBinding(SupportsShouldProcess=$true)] # Enables -WhatIf and -Confirm
param (
    [Parameter(Mandatory=$true,
               Position=0,
               HelpMessage="Enter the path to the folder containing the files.")]
    [string]$FolderPath
)

if (-not (Test-Path -Path $FolderPath -PathType Container)) {
    Write-Error "The specified source folder path does not exist or is not a folder: '$FolderPath'"
    exit 1
}

Write-Host "Processing files in folder: $FolderPath"
Write-Host "Target subfolder for copies: newnames"
Write-Host "------------------------------------------"

# Define the destination subfolder name and path
$destinationSubfolderName = "newnames"
$destinationFolderPath = Join-Path -Path $FolderPath -ChildPath $destinationSubfolderName

# Create the destination subfolder if it doesn't exist
if (-not (Test-Path -Path $destinationFolderPath -PathType Container)) {
    Write-Verbose "Destination subfolder '$destinationFolderPath' does not exist. Attempting to create it."
    try {
        # --- CREATE DIRECTORY OPERATION ---
        # Remove -WhatIf to perform actual creation.
        New-Item -ItemType Directory -Path $destinationFolderPath -WhatIf -ErrorAction Stop | Out-Null
        if ($PSCmdlet.ShouldProcess($destinationFolderPath, "Create Directory")) {
             # This part executes if -WhatIf is NOT active on New-Item OR if user confirms with -Confirm
             # Write-Host "Successfully created destination subfolder: '$destinationFolderPath'"
        }
    } catch {
        Write-Error "Failed to create destination subfolder '$destinationFolderPath'. Error: $($_.Exception.Message)"
        Write-Error "Please ensure you have write permissions in '$FolderPath' or create the '$destinationSubfolderName' subfolder manually."
        exit 1
    }
} else {
    Write-Verbose "Destination subfolder '$destinationFolderPath' already exists."
}

# Get all files in the specified source folder (not directories)
$files = Get-ChildItem -Path $FolderPath -File -ErrorAction SilentlyContinue

if ($null -eq $files -or $files.Count -eq 0) {
    Write-Warning "No files found in the specified source folder: '$FolderPath'"
    exit 0
}

$copiedCount = 0
$skippedCount = 0

foreach ($file in $files) {
    $originalFullName = $file.FullName
    $originalName = $file.Name # e.g., "My File Name.TXT"

    # 1. Convert original name to lowercase
    $newNameLower = $originalName.ToLower()

    # 2. Replace blanks with dashes in the lowercased name
    $newNameFinal = $newNameLower.Replace(" ", "-")

    # Define the full path for the new copied file
    $newDestinationFilePath = Join-Path -Path $destinationFolderPath -ChildPath $newNameFinal

    Write-Verbose "Original: '$($file.DirectoryName)\$originalName' -> Proposed copy to: '$newDestinationFilePath'"

    # Check if a file with the new name already exists in the destination
    if (Test-Path -Path $newDestinationFilePath -PathType Leaf) {
        Write-Warning "Skipping copy for '$originalName': Target file '$newDestinationFilePath' already exists."
        $skippedCount++
        continue # Skip to the next file
    }

    # Check if the name actually changed (though for copying, we might always want to copy unless it's identical)
    # For this script's purpose (copying to a subfolder), we will attempt to copy even if the name is "unchanged"
    # by the transformation, as the location is different.
    # However, if $originalName -eq $newNameFinal and you wanted to skip, you could add:
    # if ($originalName -eq $newNameFinal) {
    #     Write-Verbose "Skipping copy for '$originalName' as the transformed name is identical and it's already in the source folder."
    #     continue
    # }

    try {
        # --- THE ACTUAL COPY OPERATION ---
        # Remove -WhatIf to perform actual copying.
        # Add -Confirm to be prompted for each copy.
        Copy-Item -Path $originalFullName -Destination $newDestinationFilePath -WhatIf -ErrorAction Stop

        # If -WhatIf is present, the above line only simulates.
        if ($PSCmdlet.ShouldProcess($originalFullName, "Copy to $newDestinationFilePath")) {
            # This block runs if -WhatIf is NOT active for Copy-Item (or user confirms with -Confirm)
            # Write-Host "Successfully copied '$originalName' to '$newDestinationFilePath'"
            $copiedCount++
        }
    } catch {
        Write-Error "Failed to copy '$originalName' to '$newDestinationFilePath'. Error: $($_.Exception.Message)"
        $skippedCount++
    }
}

Write-Host "------------------------------------------"
Write-Host "File copying process complete."
Write-Host "Files processed: $($files.Count)"
Write-Host "Files successfully copied (or would be copied with -WhatIf): $copiedCount"
Write-Host "Files skipped (e.g., target exists, error): $skippedCount"

if ($PSCmdlet.WhatIfPreference -eq $true -or ($PSBoundParameters.ContainsKey('WhatIf') -and $PSBoundParameters.WhatIf)) {
    Write-Warning "The script ran in -WhatIf mode. No actual files were copied, and the 'newnames' folder might only have been simulated."
    Write-Warning "To apply changes, remove or comment out the '-WhatIf' switch from 'New-Item' and 'Copy-Item' commands in the script."
}
```

**How to Use:**

1.  **Save:** Save the code as a `.ps1` file (e.g., `Copy-Rename-MyFiles.ps1`).
2.  **Open PowerShell:** Navigate to the directory where you saved the script.
3.  **Execution Policy (if needed):** `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
4.  **Run with `-WhatIf` (Test Run):**

    ```powershell
    .\Copy-Rename-MyFiles.ps1 -FolderPath "C:\Path\To\Your\Folder"
    ```

    or for more detail:

    ```powershell
    .\Copy-Rename-MyFiles.ps1 -FolderPath "C:\Path\To\Your\Folder" -Verbose
    ```

    This will show you output like:

    -   `What if: Performing the operation "Create Directory" on target "Destination: C:\Path\To\Your\Folder\newnames".`
    -   `What if: Performing the operation "Copy File" on target "Item: C:\Path\To\Your\Folder\My Original File.txt Destination: C:\Path\To\Your\Folder\newnames\my-original-file.txt".`

5.  **Review Output:** Check if the "newnames" folder creation is simulated and if the copy operations look correct.
6.  **Run for Real (Apply Changes):**
    -   Edit the script `Copy-Rename-MyFiles.ps1`.
    -   Find the line: `New-Item -ItemType Directory -Path $destinationFolderPath -WhatIf -ErrorAction Stop | Out-Null`
        -   **Remove `-WhatIf`**: `New-Item -ItemType Directory -Path $destinationFolderPath -ErrorAction Stop | Out-Null`
    -   Find the line: `Copy-Item -Path $originalFullName -Destination $newDestinationFilePath -WhatIf -ErrorAction Stop`
        -   **Remove `-WhatIf`**: `Copy-Item -Path $originalFullName -Destination $newDestinationFilePath -ErrorAction Stop`
    -   Save the script.
    -   Run it again:
        ```powershell
        .\Copy-Rename-MyFiles.ps1 -FolderPath "C:\Path\To\Your\Folder"
        ```

**Key Changes and Explanation:**

1.  **`$destinationSubfolderName` and `$destinationFolderPath`:** Variables to define and construct the path to the "newnames" subfolder.
2.  **Create "newnames" Subfolder:**
    -   `if (-not (Test-Path -Path $destinationFolderPath -PathType Container))`: Checks if the "newnames" subfolder exists.
    -   `New-Item -ItemType Directory -Path $destinationFolderPath -WhatIf`: Creates the directory. `-WhatIf` is included here too for the simulation.
    -   The `try-catch` block handles potential errors during folder creation (e.g., permission issues).
3.  **`$newDestinationFilePath`:** Constructs the full path for where the copied file will go (inside "newnames" with the new name).
4.  **Collision Check in Destination:**
    -   `if (Test-Path -Path $newDestinationFilePath -PathType Leaf)`: Before attempting to copy, it checks if a file with the _exact same new name_ already exists in the `newnames` folder. If it does, it skips that file to prevent overwriting and logs a warning.
5.  **`Copy-Item` Cmdlet:**
    -   Replaces `Rename-Item`.
    -   `-Path $originalFullName`: The source file.
    -   `-Destination $newDestinationFilePath`: The full path (including new name) where the file will be copied.
    -   `-WhatIf` is used here for the simulation run.
6.  **Counters:** `$copiedCount` and `$skippedCount` are added to give a summary of operations.
7.  **Final `-WhatIf` Check:** The script provides a more explicit check at the end to remind the user if `-WhatIf` mode was active using `$PSCmdlet.WhatIfPreference`.

This version is much safer for initial runs as your original data remains untouched.