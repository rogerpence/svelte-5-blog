---
title: PowerShell - making get-childitem faster and other tips
description: PowerShell - making get-childitem faster and other tips
date_created: '2025-07-12T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - powershell
---
## A primer on `get-childitem` performance
Excellent question. This gets to the heart of how PowerShell processes command-line arguments and is a crucial distinction for both performance and correctness.

While the two commands might seem to produce the same result in a simple directory, they work in fundamentally different ways.

### TL;DR Summary

*   `Get-ChildItem -Path . -Filter '*.svelte'` is the **correct and efficient** method. It asks the file system provider to do the filtering, which is extremely fast.
*   `Get-ChildItem '*.svelte'` is a **shortcut that relies on wildcard expansion** by the PowerShell engine *before* the command runs. It's less efficient and only works for the current directory (not recursively).


### 1. `Get-ChildItem -Path . -Filter '*.svelte'` (The Explicit, Efficient Way)

This is the **provider-side filtering** method we discussed.

*   **How it works:**
    1.  PowerShell sees the command `Get-ChildItem`.
    2.  It binds the argument `.` to the `-Path` parameter.
    3.  It binds the argument `'*.svelte'` to the `-Filter` parameter.
    4.  `Get-ChildItem` then makes a single, optimized call to the underlying file system API, saying: "In the directory `.` (the current directory), please give me a list of all items that match the pattern `*.svelte`."
    5.  The operating system's file system driver, which is highly optimized for this task, performs the search and returns only the matching files.

*   **Advantages:**
    *   **Performance:** This is the fastest way. The filtering is done at the source by a low-level, optimized component.
    *   **Clarity:** The command is explicit and self-documenting. It's clear that you are specifying a path and a filter.
    *   **Consistency:** It works the same way whether you add `-Recurse` or not.


### 2. `Get-ChildItem '*.svelte'` (The Implicit, Less Efficient Way)

This method uses **PowerShell's argument resolver** and **positional parameters**.

*   **How it works:**
    1.  Before `Get-ChildItem` is even executed, the PowerShell engine sees the unquoted string `*.svelte`. It recognizes `*` as a wildcard character.
    2.  PowerShell **expands this wildcard itself**. It scans the current directory for any file names that match the pattern `*.svelte`.
    3.  Let's say your directory contains `App.svelte` and `Card.svelte`. The PowerShell engine effectively **rewrites the command** in memory to:
        ```powershell
        Get-ChildItem -Path 'App.svelte', 'Card.svelte'
        ```
    4.  Only then is `Get-ChildItem` executed with this pre-compiled list of file names passed to its first positional parameter, which is `-Path`.

*   **Disadvantages:**
    *   **Performance:** This is a two-step process (PowerShell expands, then `gci` runs) which is slower, especially with many matching files. PowerShell is not as fast at file name globbing as the file system itself.
    *   **Scope Limitation:** This wildcard expansion **only works in the current directory**. It cannot be used with `-Recurse` to find all `.svelte` files in subdirectories. The command `Get-ChildItem *.svelte -Recurse` would fail to find files in subfolders because the `*.svelte` part is resolved *before* the recursion even starts.
    *   **Potential for Errors:** If the wildcard expands to a huge number of files, you can potentially exceed the command-line argument length limit, leading to an "Argument list too long" error (this is more common in Linux/macOS shells but can happen in PowerShell).


### Comparison Table

| Feature                    | `Get-ChildItem -Filter '*.svelte'`                       | `Get-ChildItem '*.svelte'`                                                                      |
| :------------------------- | :------------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| **Who Filters?**           | **File System Provider (OS)**                            | **PowerShell Engine** (before command runs)                                                     |
| **Mechanism**              | A single call to the OS API with a filter.               | PowerShell expands the wildcard into a list of names, then passes that list to `Get-ChildItem`. |
| **Performance**            | **Very High**. The most efficient method.                | **Lower**. Slower due to the two-step process.                                                  |
| **Works with `-Recurse`?** | **Yes**. Finds all matching files recursively.           | **No**. Only finds files in the starting directory.                                             |
| **Clarity & Robustness**   | **High**. Explicit and less prone to side effects.       | **Low**. Relies on implicit behavior that can be confusing.                                     |
| **Recommended Use**        | **Always**. The best practice for scripts and daily use. | **Rarely**. Only for quick, interactive commands in a single directory.                         |

### Conclusion

You should **always prefer `Get-ChildItem -Filter '*.svelte'`**.

It is more performant, more reliable, more readable, and works intuitively with other parameters like `-Recurse`. The positional wildcard shortcut (`gci *.svelte`) should be avoided in any script and is generally not considered a best practice even for interactive use.


## Quick and dirty to exclude inner folders

Of course. Excluding folders is a very common requirement, especially to avoid searching in directories like `node_modules` or build output folders like `.svelte-kit`.

The best and most reliable way to do this is by piping the results of `Get-ChildItem` to the `Where-Object` cmdlet to filter based on the full path.

### Recommended Method: Using `Where-Object`

This method is the most flexible and reliable. It lets `Get-ChildItem` find all files and then filters out the ones whose paths contain the folder names you want to exclude.

Here is the updated command to exclude `node_modules` and `.svelte-kit` folders:

```powershell
Get-ChildItem -Path . -Filter '*.svelte' -Recurse | 
    Where-Object { $_.FullName -notlike '*\node_modules\*' -and $_.FullName -notlike '*\.svelte-kit\*' } | 
    Select-Object Name, FullName | 
    Sort-Object Name | 
    Out-GridView
```

#### Breakdown of the Change:

*   **`| Where-Object { ... }`**: We've inserted this clause into the pipeline after `Get-ChildItem`. `Where-Object` (alias: `where`) filters the objects that pass through it.
*   **`$_.FullName`**: For each file object (`$_`) coming from `Get-ChildItem`, we look at its `FullName` property (e.g., `C:\project\src\routes\Component.svelte`).
*   **`-notlike '*\node_modules\*'`**: This is the core logic. It checks if the `FullName` is **not like** the specified pattern.
    *   The asterisks `*` are wildcards, meaning "match any characters".
    *   So `*\node_modules\*` matches any path that contains a `\node_modules\` folder anywhere in it.
    *   We use backslashes `\` as the path separator for Windows. If you are on Linux/macOS, you might use `/` instead, but `\` often works cross-platform within PowerShell.
*   **`-and`**: This operator ensures that a file is only included if **both** conditions are true (its path doesn't contain `node_modules` AND it doesn't contain `.svelte-kit`).


### Alternative Method: Using Regular Expressions with `-notmatch`

If you have many folders to exclude, using the `-notmatch` operator with a regular expression can be cleaner.

```powershell
Get-ChildItem -Path . -Filter '*.svelte' -Recurse | 
    Where-Object { $_.FullName -notmatch '\\(node_modules|\\.svelte-kit)\\' } |
    Select-Object Name, FullName |
    Sort-Object Name |
    Out-GridView
```

#### Breakdown of the Regex:

*   **`-notmatch`**: This operator filters out items that match a regular expression.
*   **`'\\(node_modules|\\.svelte-kit)\\'`**: This is the regular expression pattern.
    *   `\\`: A literal backslash. The first backslash escapes the second one.
    *   `(`...`)`: A capturing group.
    *   `node_modules | \\.svelte-kit`: The `|` acts as an "OR". It will match `node_modules` OR `\.svelte-kit`.
    *   `\\.`: Since `.` is a special character in regex (meaning "any character"), we must escape it with a `\` to match a literal dot. Again, the first `\` escapes the second for the PowerShell string.
    *   The full pattern looks for `\node_modules\` or `\.svelte-kit\` anywhere in the path.


### Why Not Use `Get-ChildItem -Exclude`?

You might be tempted to use the `-Exclude` parameter of `Get-ChildItem`, like this:

```powershell
Get-ChildItem -Path . -Filter '*.svelte' -Recurse -Exclude 'node_modules', '.svelte-kit'
```

**This approach fails for this use case.** The `-Exclude` parameter applies to the *name of the item being returned* (the file or folder itself), not to the path it resides in. Since `Get-ChildItem` with `-Filter '*.svelte'` is only returning `.svelte` files, their names will never be `node_modules` or `.svelte-kit`, so `-Exclude` will never match and nothing will be excluded.

The `Where-Object` method correctly inspects the **entire path** of each file, making it the right tool for the job.

### Final Recommendation

Stick with the first method using **`Where-Object` and `-notlike`**. It's readable, powerful, and the standard way to solve this problem in PowerShell.

```powershell
Get-ChildItem -Path . -Filter '*.svelte' -Recurse | Where-Object { $_.FullName -notlike '*\node_modules\*' -and $_.FullName -notlike '*\.svelte-kit\*' } | Select-Object Name, FullName | Sort-Object Name | Out-GridView
```

## Using regex to exclude inner folders with `get-childitem`

Of course. Using a list or an array to define the folders to exclude is the best practice for making your command clean, maintainable, and easy to modify.

The most powerful and efficient way to do this is to dynamically build a regular expression from your list of folder names.

### Recommended Method: Using a List and a Regular Expression

This approach is clean, scalable, and correctly handles special characters in folder names.

1.  **Define your list of folders to exclude.**
2.  **Convert that list into a single regex pattern.**
3.  **Use that pattern with the `-notmatch` operator.**

Here is the complete, ready-to-use command:

```powershell
# 1. Define the list of folder names to exclude
$excludeFolders = @(
    'node_modules',
    '.svelte-kit',
    'build',
    'dist'
)

# 2. Build a regex pattern from the list. This makes the command robust.
#    It joins the names with '|' (OR) and escapes any special regex characters.
$regexPattern = ($excludeFolders | ForEach-Object { [regex]::Escape($_) }) -join '|'

# 3. Execute the command using the dynamically created regex
Get-ChildItem -Path . -Filter '*.svelte' -Recurse | 
    Where-Object { $_.FullName -notmatch "\\($regexPattern)\\" } |
    Select-Object Name, FullName |
    Sort-Object Name |
    Out-GridView
```

### Breakdown of This Method

#### Step 1: The Array
```powershell
$excludeFolders = @(
    'node_modules',
    '.svelte-kit',
    # Add any other folder names here
    'dist' 
)
```
This creates a standard PowerShell array. It's incredibly easy to add or remove folders from this list without touching the main command logic.

#### Step 2: The Regex Builder
```powershell
$regexPattern = ($excludeFolders | ForEach-Object { [regex]::Escape($_) }) -join '|'
```
This is the clever part that makes the solution so robust:
*   `$excludeFolders | ForEach-Object { ... }`: This iterates through each folder name in your list.
*   `[regex]::Escape($_)`: **This is very important.** It takes a folder name (like `.svelte-kit`) and escapes any characters that have a special meaning in regular expressions. For instance, it turns the `.` into `\.`, ensuring it matches a literal dot and not "any character".
*   `-join '|'`: This takes the list of escaped folder names and joins them together into a single string, separated by the `|` (OR) character.

If `$excludeFolders` is `@('node_modules', '.svelte-kit')`, the resulting `$regexPattern` will be `node_modules|\.svelte-kit`.

#### Step 3: The Filter
```powershell
... | Where-Object { $_.FullName -notmatch "\\($regexPattern)\\" } | ...
```
*   `$_.FullName -notmatch ...`: We use `-notmatch` to filter against our regex pattern.
*   `"\\($regexPattern)\\"`: We embed our pattern inside the full check. The surrounding `\\` characters ensure we are matching a full directory name (e.g., `\node_modules\`) and not just a partial file or folder name.


### Alternative: A Simpler (But More Verbose) Loop

If you are not comfortable with regular expressions, you can use a more explicit loop inside the `Where-Object` clause. This is slightly less performant but can be easier to read for some.

```powershell
$excludeFolders = @(
    'node_modules',
    '.svelte-kit',
    'build',
    'dist'
)

Get-ChildItem -Path . -Filter '*.svelte' -Recurse | 
    Where-Object {
        $path = $_.FullName
        # Check if the path contains ANY of the excluded folder names
        $isExcluded = $false
        foreach ($folder in $excludeFolders) {
            if ($path -like "*\$folder\*") {
                $isExcluded = $true
                break # Found a match, no need to check further, exit the loop
            }
        }
        -not $isExcluded # Keep the item only if it was NOT found in the exclude list
    } |
    Select-Object Name, FullName |
    Sort-Object Name |
    Out-GridView
```

### Comparison

| Method | Pros | Cons |
| :--- | :--- | :--- |
| **Regex (Recommended)** | **Concise and fast.** The standard "PowerShell" way to solve this. Highly scalable. | Requires understanding a bit of regex. |
| **Verbose Loop** | **Very explicit and easy to read** if you are unfamiliar with regex. | More code, slightly slower due to the nested loop for every file. |

For any real-world script, the **regex method is superior**. It's a common and powerful pattern in PowerShell scripting.

## Exclude top-level folders

Excellent question. This is a very common and important scenario, and solving it efficiently requires a different approach than simply filtering the final results.

You want to prevent `Get-ChildItem` from ever entering the `bob` and `tom` folders in the first place. This is much more performant than letting it search everywhere and then filtering the results afterward, especially if `bob` or `tom` were something huge like `node_modules`.

The strategy is to first get a list of the top-level directories you *want* to search, and then run your recursive search inside each of them.

Here is the solution presented as a clear, step-by-step script.

### Step-by-Step Script to Exclude Top-Level Folders

This script is designed for clarity and is easy to modify.

```powershell
# Step 1: Configure the folders you want to exclude.
# This makes it easy to add or remove folders later without changing the main logic.
$foldersToExclude = @(
    'bob',
    'tom'
    # You can add more folder names here, e.g., 'node_modules', '.git'
)

Write-Host "Starting search. Excluding top-level folders: $($foldersToExclude -join ', ')" -ForegroundColor Yellow

# Step 2: Get all top-level directories in the current location, EXCLUDING the ones in our list.
# The -Directory switch ensures we only get folders.
# The -Exclude parameter efficiently filters them by name at the source.
$foldersToSearch = Get-ChildItem -Path . -Directory -Exclude $foldersToExclude

Write-Host "Found $($foldersToSearch.Count) folders to search in."

# Step 3: Loop through each of the approved folders and find all '*.svelte' files recursively inside them.
# The results from each loop are automatically collected into the $allSvelteFiles variable.
$allSvelteFiles = foreach ($folder in $foldersToSearch) {
    Write-Host " -> Searching in $($folder.FullName)..."
    Get-ChildItem -Path $folder.FullName -Filter '*.svelte' -Recurse
}

Write-Host "Found a total of $($allSvelteFiles.Count) svelte files." -ForegroundColor Green

# Step 4: Process the collected files.
# If any files were found, select the desired properties, sort them, and show them in the grid.
if ($allSvelteFiles) {
    $allSvelteFiles | 
        Select-Object Name, FullName | 
        Sort-Object Name | 
        Out-GridView -Title "Svelte Files (Excluding Specified Folders)"
} else {
    Write-Host "No '.svelte' files found in the searched directories."
}
```

### How to Run This Script

1.  Save the code above as a `.ps1` file (e.g., `Find-SvelteFiles.ps1`).
2.  Open a PowerShell terminal and navigate to the root directory where you want to start the search.
3.  Run the script by typing its path: `.\Find-SvelteFiles.ps1`.

### Why This Method is Better

*   **Performance:** The script completely avoids traversing the directory trees of `bob` and `tom`. If those folders contained thousands of files, you would save a significant amount of time and I/O operations.
*   **Clarity:** The logic is broken down into clear, understandable steps. You can see exactly which folders are being included and excluded.
*   **Maintainability:** To change which folders are excluded, you only need to edit the `$foldersToExclude` array at the top. The rest of the script remains unchanged.


### One-Liner Alternative

If you prefer a more compact command-line approach, you can chain these concepts together into a single pipeline. This does the exact same thing as the script but in a more condensed format.

```powershell
Get-ChildItem -Path . -Directory -Exclude 'bob','tom' | ForEach-Object { Get-ChildItem -Path $_.FullName -Filter '*.svelte' -Recurse } | Select-Object Name, FullName | Sort-Object Name | Out-GridView
```

**Breakdown of the one-liner:**

1.  `Get-ChildItem -Path . -Directory -Exclude 'bob','tom'`: Gets the list of top-level directories to search in.
2.  `| ForEach-Object { ... }`: For each of those directories...
3.  `Get-ChildItem -Path $_.FullName -Filter '*.svelte' -Recurse`: ...run the recursive search for `.svelte` files. The results are passed down the pipeline.
4.  `| Select-Object ... | Sort-Object ... | Out-GridView`: The final processing and display steps are applied to the combined results.