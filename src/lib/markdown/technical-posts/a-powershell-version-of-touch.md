---
title: A PowerShell version of touch
description: A PowerShell version of touch
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-31
date_published:
pinned: false
tags:
  - powershell
---
**Script: `ps-touch.ps1`**

adsfasdfadsf

```powershell
<#
.SYNOPSIS
Recursively finds files with a specified extension within a given folder structure
and updates their 'LastWriteTime' (Date Modified) if they are older than a
given filter date/time.

.DESCRIPTION
This script takes a starting folder path, a filter date/time, a new
date/time, and a file extension as input. It searches recursively for all files
with the specified extension (e.g., .md, .txt, .log) within the starting folder.
For each matching file found, it checks if its 'LastWriteTime' property is
earlier than the specified filter date/time. If it is, the script updates
the file's 'LastWriteTime' to the new date/time provided.

.PARAMETER FolderPath
The top-level folder path where the search for files should begin.
The script will search recursively within this folder.

.PARAMETER FilterDateTime
The date and time used as a threshold. Files with a 'LastWriteTime'
strictly *less than* this value will be modified.
Please use a format PowerShell can understand (e.g., "yyyy-MM-dd HH:mm:ss", "MM/dd/yyyy hh:mm tt", "2023-10-27 15:30:00").

.PARAMETER NewDateTime
The new date and time to set as the 'LastWriteTime' for the files that
meet the filter criteria.
Please use a format PowerShell can understand (e.g., "yyyy-MM-dd HH:mm:ss", "MM/dd/yyyy hh:mm tt", "2024-01-01 09:00:00").

.PARAMETER FileExtension
The file extension to search for (e.g., "md", ".txt", "log").
The leading dot is optional (both "txt" and ".txt" will work).

.EXAMPLE
.\Update-FileTimestampByExtension.ps1 -FolderPath "C:\MyData" -FilterDateTime "2023-01-01" -NewDateTime "2023-12-31 23:59:59" -FileExtension "log"
This command searches C:\MyData and its subfolders for .log files modified
before January 1st, 2023, and changes their modified date to December 31st, 2023.

.EXAMPLE
.\Update-FileTimestampByExtension.ps1 -FolderPath ".\Docs" -FilterDateTime "2023-10-27 10:00" -NewDateTime (Get-Date) -FileExtension ".docx"
This command searches the .\Docs folder and its subfolders for .docx files
modified before 10:00 AM on October 27th, 2023, and changes their modified date
to the *current* date and time.

.NOTES
Author: Your Name/AI Assistant
Date:   2023-10-27
Ensure you have the necessary permissions to modify files in the target directory.
It's recommended to back up files or test in a non-critical directory first.
#>
[CmdletBinding(SupportsShouldProcess=$true)] # Adds -WhatIf and -Confirm support
param(
    [Parameter(Mandatory=$true, Position=0)]
    [ValidateScript({
        if (Test-Path -Path $_ -PathType Container) {
            return $true
        } else {
            throw "Folder not found: $_"
        }
    })]
    [string]$FolderPath,

    [Parameter(Mandatory=$true, Position=1)]
    [datetime]$FilterDateTime,

    [Parameter(Mandatory=$true, Position=2)]
    [datetime]$NewDateTime,

    [Parameter(Mandatory=$true, Position=3)]
    [ValidateNotNullOrEmpty()]
    [string]$FileExtension
)


Write-Verbose "Starting script..."
Write-Verbose "Searching in folder: '$FolderPath'"
Write-Verbose "Filtering files modified before: '$($FilterDateTime.ToString('yyyy-MM-dd HH:mm:ss'))'"
Write-Verbose "Setting new modification date to: '$($NewDateTime.ToString('yyyy-MM-dd HH:mm:ss'))'"

$normalizedExtension = if ($FileExtension.StartsWith('.')) { $FileExtension } else { ".$FileExtension" }
$filterPattern = "*$normalizedExtension"

Write-Verbose "Searching for file extension: '$normalizedExtension' using filter pattern: '$filterPattern'"


$filesUpdatedCount = 0
$filesCheckedCount = 0

try {
    # Get all files matching the extension recursively
    $targetFiles = Get-ChildItem -Path $FolderPath -Filter $filterPattern -Recurse -File -ErrorAction Stop

    Write-Host "Found $($targetFiles.Count) '$filterPattern' files. Checking modification dates..."

    # Loop through each file
    foreach ($file in $targetFiles) {
        $filesCheckedCount++
        Write-Verbose "Checking file: $($file.FullName) | LastWriteTime: $($file.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss'))"

        # Compare the file's LastWriteTime with the filter date
        if ($file.LastWriteTime -lt $FilterDateTime) {
            Write-Host ("Updating timestamp for: {0} (Original: {1})" -f $file.FullName, $file.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss'))

            # Use -WhatIf / -Confirm support provided by [CmdletBinding(SupportsShouldProcess=$true)]
            if ($PSCmdlet.ShouldProcess($file.FullName, "Set LastWriteTime to $NewDateTime")) {
                try {
                    # Set the LastWriteTime property
                    # Note: Setting other timestamps like CreationTime or LastAccessTime can be done similarly if needed.
                    $file.LastWriteTime = $NewDateTime
                    $filesUpdatedCount++
                } catch {
                    Write-Warning "Could not update timestamp for '$($file.FullName)': $($_.Exception.Message)"
                }
            }
        } else {
            Write-Verbose "Skipping file (not older than filter date): $($file.FullName)"
        }
    }

    Write-Host "-------------------------------------"
    Write-Host "Script finished."
    Write-Host "Total '$filterPattern' files checked: $filesCheckedCount"
    Write-Host "Total files updated: $filesUpdatedCount"
    Write-Host "-------------------------------------"

} catch [System.Management.Automation.ItemNotFoundException] {
    Write-Error "The specified folder path '$FolderPath' was not found or is inaccessible after initial check."
} catch {
    # Catch any other potential errors during Get-ChildItem or processing
    Write-Error "An unexpected error occurred: $($_.Exception.Message)"
    Write-Error $_.ScriptStackTrace
}

Write-Verbose "Exiting script."
```

**Changes Made:**

1.  **Parameter Added:**
    -   A new parameter `$FileExtension` of type `[string]` was added to the `param()` block.
    -   It's marked as `Mandatory=$true` and assigned `Position=3`.
    -   `[ValidateNotNullOrEmpty()]` attribute was added to ensure the user provides a non-empty extension.
2.  **Normalize Extension & Create Filter:**
    -   A small block of code was added to ensure the extension starts with a dot (`.`) and to create the filter pattern (e.g., `*.txt`). This makes the script more user-friendly as they can type `txt` or `.txt`.
    ```powershell
    $normalizedExtension = if ($FileExtension.StartsWith('.')) { $FileExtension } else { ".$FileExtension" }
    $filterPattern = "*$normalizedExtension"
    ```
3.  **Dynamic `Get-ChildItem`:**
    -   The `-Filter` argument in `Get-ChildItem` now uses the `$filterPattern` variable instead of the hardcoded `"*.md"`.
    ```powershell
    $targetFiles = Get-ChildItem -Path $FolderPath -Filter $filterPattern -Recurse -File -ErrorAction Stop
    ```
4.  **Updated Variable Name:**
    -   Changed `$mdFiles` to the more generic `$targetFiles`.
5.  **Updated Output Messages:**
    -   Messages displayed using `Write-Host` and `Write-Verbose` were updated to reflect the dynamic file extension being processed (using `$filterPattern`).

**How to Use (Examples):**

-   **Update `.log` files:**
    ```powershell
    .\Update-FileTimestampByExtension.ps1 -FolderPath "C:\ServerLogs" -FilterDateTime "2023-09-01" -NewDateTime "2024-01-01 08:00:00" -FileExtension "log"
    ```
-   **Update `.txt` files (using extension without dot):**
    ```powershell
    .\Update-FileTimestampByExtension.ps1 -FolderPath "C:\Notes" -FilterDateTime "2023-10-27 12:00" -NewDateTime (Get-Date) -FileExtension txt
    ```
-   **Dry run for `.tmp` files:**
    ```powershell
    .\Update-FileTimestampByExtension.ps1 -FolderPath "C:\Temp" -FilterDateTime "2023-01-01" -NewDateTime "2023-12-31" -FileExtension ".tmp" -WhatIf
    ```


## Original without FileExtension argument

Okay, here is a PowerShell script that accomplishes this.

**Script: `Update-MdFileTimestamp.ps1`**

```powershell
<#
.SYNOPSIS
Recursively finds Markdown files (.md) within a specified folder structure
and updates their 'LastWriteTime' (Date Modified) if they are older than a
given filter date/time.

.DESCRIPTION
This script takes a starting folder path, a filter date/time, and a new
date/time as input. It searches recursively for all files with the '.md'
extension within the starting folder. For each '.md' file found, it checks
if its 'LastWriteTime' property is earlier than the specified filter date/time.
If it is, the script updates the file's 'LastWriteTime' to the new date/time
provided.

.PARAMETER FolderPath
The top-level folder path where the search for .md files should begin.
The script will search recursively within this folder.

.PARAMETER FilterDateTime
The date and time used as a threshold. Files with a 'LastWriteTime'
strictly *less than* this value will be modified.
Please use a format PowerShell can understand (e.g., "yyyy-MM-dd HH:mm:ss", "MM/dd/yyyy hh:mm tt", "2023-10-27 15:30:00").

.PARAMETER NewDateTime
The new date and time to set as the 'LastWriteTime' for the files that
meet the filter criteria.
Please use a format PowerShell can understand (e.g., "yyyy-MM-dd HH:mm:ss", "MM/dd/yyyy hh:mm tt", "2024-01-01 09:00:00").

.EXAMPLE
.\Update-MdFileTimestamp.ps1 -FolderPath "C:\MyNotes" -FilterDateTime "2023-01-01 00:00:00" -NewDateTime "2023-12-31 23:59:59"
This command searches C:\MyNotes and its subfolders for .md files modified
before January 1st, 2023, and changes their modified date to December 31st, 2023.

.EXAMPLE
.\Update-MdFileTimestamp.ps1 -FolderPath ".\Documents" -FilterDateTime "2023-10-27 10:00" -NewDateTime (Get-Date)
This command searches the .\Documents folder (relative to the current location)
and its subfolders for .md files modified before 10:00 AM on October 27th, 2023,
and changes their modified date to the *current* date and time.

.NOTES
Author: Your Name/AI Assistant
Date:   2023-10-27
Ensure you have the necessary permissions to modify files in the target directory.
It's recommended to back up files or test in a non-critical directory first.
#>
[CmdletBinding(SupportsShouldProcess=$true)] # Adds -WhatIf and -Confirm support
param(
    [Parameter(Mandatory=$true, Position=0)]
    [ValidateScript({
        if (Test-Path -Path $_ -PathType Container) {
            return $true
        } else {
            throw "Folder not found: $_"
        }
    })]
    [string]$FolderPath,

    [Parameter(Mandatory=$true, Position=1)]
    [datetime]$FilterDateTime,

    [Parameter(Mandatory=$true, Position=2)]
    [datetime]$NewDateTime
)

# --- Script Body ---

Write-Verbose "Starting script..."
Write-Verbose "Searching in folder: '$FolderPath'"
Write-Verbose "Filtering files modified before: '$($FilterDateTime.ToString('yyyy-MM-dd HH:mm:ss'))'"
Write-Verbose "Setting new modification date to: '$($NewDateTime.ToString('yyyy-MM-dd HH:mm:ss'))'"

$filesUpdatedCount = 0
$filesCheckedCount = 0

try {
    # Get all .md files recursively
    $mdFiles = Get-ChildItem -Path $FolderPath -Filter "*.md" -Recurse -File -ErrorAction Stop

    Write-Host "Found $($mdFiles.Count) *.md files. Checking modification dates..."

    # Loop through each file
    foreach ($file in $mdFiles) {
        $filesCheckedCount++
        Write-Verbose "Checking file: $($file.FullName) | LastWriteTime: $($file.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss'))"

        # Compare the file's LastWriteTime with the filter date
        if ($file.LastWriteTime -lt $FilterDateTime) {
            Write-Host ("Updating timestamp for: {0} (Original: {1})" -f $file.FullName, $file.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss'))

            # Use -WhatIf / -Confirm support provided by [CmdletBinding(SupportsShouldProcess=$true)]
            if ($PSCmdlet.ShouldProcess($file.FullName, "Set LastWriteTime to $NewDateTime")) {
                try {
                    $file.LastWriteTime = $NewDateTime
                    $filesUpdatedCount++
                } catch {
                    Write-Warning "Could not update timestamp for '$($file.FullName)': $($_.Exception.Message)"
                }
            }
        } else {
            Write-Verbose "Skipping file (not older than filter date): $($file.FullName)"
        }
    }

    Write-Host "-------------------------------------"
    Write-Host "Script finished."
    Write-Host "Total *.md files checked: $filesCheckedCount"
    Write-Host "Total files updated: $filesUpdatedCount"
    Write-Host "-------------------------------------"

} catch [System.Management.Automation.ItemNotFoundException] {
    Write-Error "The specified folder path '$FolderPath' was not found or is inaccessible after initial check."
} catch {
    # Catch any other potential errors during Get-ChildItem or processing
    Write-Error "An unexpected error occurred: $($_.Exception.Message)"
    Write-Error $_.ScriptStackTrace
}

Write-Verbose "Exiting script."
```

**How to Use:**

1.  **Save:** Save the code above into a file named `Update-MdFileTimestamp.ps1`.
2.  **Open PowerShell:** Open a PowerShell console.
3.  **Execution Policy:** If you haven't run scripts before, you might need to change the execution policy. You can do this for the current session by running:
    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
    ```
4.  **Run the Script:** Navigate to the directory where you saved the script (using `cd`) and run it, providing the required arguments.

    -   **Example:** To find `.md` files in `C:\Users\You\Documents\Notes`, update those modified _before_ July 1st, 2023 at midnight, and set their new modified date to January 1st, 2024 at 9 AM:

        ```powershell
        .\Update-MdFileTimestamp.ps1 -FolderPath "C:\Users\You\Documents\Notes" -FilterDateTime "2023-07-01 00:00:00" -NewDateTime "2024-01-01 09:00:00"
        ```

    -   **Using Current Date:** To set the new date to the _current_ date and time:

        ```powershell
        .\Update-MdFileTimestamp.ps1 -FolderPath "C:\Path\To\Your\Files" -FilterDateTime "2023-10-01 12:00:00" -NewDateTime (Get-Date)
        ```

    -   **Dry Run (WhatIf):** To see _what_ files would be changed without actually changing them:

        ```powershell
        .\Update-MdFileTimestamp.ps1 -FolderPath "C:\Path\To\Your\Files" -FilterDateTime "..." -NewDateTime "..." -WhatIf
        ```

    -   **Confirmation (Confirm):** To be prompted before each file change:

        ```powershell
        .\Update-MdFileTimestamp.ps1 -FolderPath "C:\Path\To\Your\Files" -FilterDateTime "..." -NewDateTime "..." -Confirm
        ```

    -   **Verbose Output:** To see more detailed messages about which files are being checked/skipped:
        ```powershell
        .\Update-MdFileTimestamp.ps1 -FolderPath "C:\Path\To\Your\Files" -FilterDateTime "..." -NewDateTime "..." -Verbose
        ```

**Explanation:**

1.  **`[CmdletBinding(SupportsShouldProcess=$true)]`**: Enables common parameters like `-WhatIf`, `-Confirm`, and `-Verbose`.
2.  **`param(...)`**: Defines the script's parameters.
    -   `[Parameter(Mandatory=$true, Position=X)]`: Makes the parameter required and allows providing arguments positionally (e.g., `.\script.ps1 folder filterdate newdate`).
    -   `[ValidateScript({...})]`: Checks if the provided `$FolderPath` actually exists and is a directory (`-PathType Container`). If not, it throws an error before the script body runs.
    -   `[string]`, `[datetime]`: Specify the expected data types. PowerShell will try to convert the input strings to these types. If it fails (e.g., invalid date format), PowerShell will raise an error.
3.  **`Write-Verbose`**: Outputs messages only when the `-Verbose` switch is used. Good for debugging or detailed logging.
4.  **`$filesUpdatedCount`, `$filesCheckedCount`**: Variables to keep track of actions.
5.  **`try...catch`**: Basic error handling block.
6.  **`Get-ChildItem`**: The core command for finding files.
    -   `-Path $FolderPath`: Specifies the starting directory.
    -   `-Filter "*.md"`: Efficiently filters for files ending in `.md`.
    -   `-Recurse`: Tells it to look inside subdirectories.
    -   `-File`: Ensures only file objects (not directories) are returned.
    -   `-ErrorAction Stop`: If `Get-ChildItem` encounters an error (like permission denied on a subfolder), it stops the script within the `try` block, allowing the `catch` block to handle it.
7.  **`foreach ($file in $mdFiles)`**: Loops through each file object found.
8.  **`$file.LastWriteTime`**: Accesses the "Date modified" property of the file.
9.  **`-lt`**: The "less than" comparison operator for dates.
10. **`$PSCmdlet.ShouldProcess(...)`**: This is used in conjunction with `SupportsShouldProcess`. It checks if the operation should proceed based on whether `-WhatIf` or `-Confirm` was used. If `-WhatIf` is present, it prints a message saying what _would_ happen. If `-Confirm` is present, it prompts the user. If neither is present, it returns `$true`.
11. **`$file.LastWriteTime = $NewDateTime`**: This is the line that actually changes the file's modification timestamp. It's placed inside the `if ($PSCmdlet.ShouldProcess(...))` block.
12. **Inner `try...catch`**: Handles potential errors specifically during the timestamp update (e.g., file becomes read-only or inaccessible between the `Get-ChildItem` call and the update attempt).
13. **Final Summary**: Prints the counts of files checked and updated.