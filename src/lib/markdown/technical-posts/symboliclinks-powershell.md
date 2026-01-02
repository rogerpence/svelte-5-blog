---
title: Create symlinks with PowerShell
description: How to create symlinks (SymbolicLink) with PowerShell. This is what enables the Brainiac Svelte project to share, in real time, markdown posts from Obsidian. PowerShell's SymbolicLink is like DOS's MKLINK command. This article also includes an explanation of PowerShell's symbolic links.
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-05T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - windows
  - powershell
---
A **junction point** (also called a **soft link** or **symbolic directory link**) in Windows is a type of symbolic link that refers to another directory on the _same_ volume. It's essentially a pointer from one directory to another. Think of it as a shortcut, but a much more integrated one.

Here's a breakdown of what it is and how it differs from other linking methods:

**Key Characteristics of Junctions:**

-   **Directory-Only:** Junctions can only point to _directories_, not individual files. This is a key distinction from symbolic links, which can link to both files and directories.

-   **Local Volume Requirement:** The target directory _must_ be on the same volume (same hard drive or partition) as the junction point itself. You can't create a junction that points to a directory on a different drive letter.

-   **Transparent Access:** When you access the junction point, Windows treats it as if you're directly accessing the contents of the target directory. Applications don't know they're being redirected.

-   **Persistency:** Junctions are persistent. They remain intact across reboots.

-   **Physical File Path Changes:** Junctions rely on the physical file path of the target directory. If the target directory is moved or renamed, the junction will break, and attempting to access it will result in an error.

**How Symlinks Work:**

A symlink echoes a folder to another virtual folder. Any changes to the files in either folder are synchronized very quickly. 

For example:

I want to echo the contents of my Obsidian Brainiac vault to another (virtual) folder. This lets me create a SvelteKit app that works with the virtual folder. 

```
  New-Item -ItemType SymbolicLink -Path <LinkPath> -Target <TargetPath>
```

Where: 
 
- `<LinkPath>`: Specifies the full path and name of the symbolic link you want to create. This is the "shortcut" or "alias."
- `<TargetPath>`: Specifies the full path to the original file or directory that the symbolic link will point to. This is the "source" or "destination."

Example:

The link path I want to create is:  `C:\Users\thumb\Documents\projects\svelte\brainiac\src\markdown` 
The source path is  `C:\Users\thumb\Documents\resilio-envoy\Obsidian\brainiac` (which is the Obsidian vault)

```
New-Item -ItemType SymbolicLink 
         -path C:\Users\thumb\Documents\projects\svelte\brainiac\src\markdown
         -target C:\Users\thumb\Documents\resilio-envoy\Obsidian\brainiac
```

In this case, the symlink folder makes it to look the SvelteKit project that the Obsidian vault markdown lives in the project's `src\markdown` folder. Any changes made to the contents in the `markdown` folder are immediately also applied to the original Obsidian vault folder (its unlikely there would be changes, but there could be a typo fixed or something like that). 

> [!info]
> The PowerShell command must be run as admin.




This provides:

1. **Redirection:** When an application tries to access `LinkDirectory`, the NTFS file system recognizes it as a junction point. Instead of directly accessing the contents of `LinkDirectory` (which doesn't actually contain any files), the file system transparently redirects the application to the contents of `TargetDirectory`.

2. **Seamless Operation:** The application continues to function as if it were directly accessing the files and subdirectories within `TargetDirectory`. It's unaware of the redirection.

**Differences from Other Types of Links:**

-   **Hard Links:** Hard links can only point to _files_, not directories, and like junctions, must be on the same volume. Multiple hard links point to the same underlying file data. If you delete one hard link, the file data remains as long as at least one hard link exists.

-   **Symbolic Links (Symlinks):** Symlinks are more flexible. They can point to files _or_ directories and can point to locations on _different_ volumes or even network shares (though network symlinks can have security implications). They are the most versatile type of link, but may require administrator privileges to create. However, some older applications may not handle symlinks correctly. Symlinks are created with `mklink /D` for directory symlinks and `mklink` (without any options) for file symlinks.

-   **Shortcuts (.lnk files):** Shortcuts are not part of the file system. They are simply files that contain information about the target file or directory. They don't provide transparent access like junctions and symlinks. When you click on a shortcut, it opens the target in its associated application. Shortcuts can point to locations on different volumes or network shares.

**Persistence**

-   **junctions do persist across reboots** in Windows. Once created, a junction point will remain intact and functional even after the system is restarted. The operating system stores the information about the junction point in the NTFS file system, so it's automatically recreated each time the computer starts.

**Use Cases for Junctions:**

-   **Moving System Folders (Carefully):** Sometimes used (though less common now due to symlinks) to relocate system folders (like Program Files, Users) to a different partition without breaking software. _This should be done with extreme caution._

-   **Organizing Large Projects:** Creating junction points can help organize complex projects by allowing you to access files from multiple locations as if they were in a single directory.

-   **Backwards Compatibility:** Sometimes used to maintain backwards compatibility with older applications that expect files to be in a specific location, even if those files have been moved.

**Example:**

Let's say you have a directory called `C:\MyProject\SourceFiles` and you want to access those files from a new directory called `C:\WorkArea`. You can create a junction point:

```
mklink /J "C:\WorkArea" "C:\MyProject\SourceFiles"
```

Now, if you navigate to `C:\WorkArea`, you'll see the same files and subdirectories that are in `C:\MyProject\SourceFiles`. Any changes you make in `C:\WorkArea` will be reflected in `C:\MyProject\SourceFiles`, and vice versa.

**Remove a junction**

You remove a junction point in Windows just like you would remove a regular directory: by using the `rmdir` command (remove directory) or by deleting it through File Explorer.

**1. Using the Command Prompt (`rmdir`)**

-   Open the Command Prompt as an administrator (right-click on the Start button and select "Command Prompt (Admin)" or "Windows Terminal (Admin)").
-   Use the `rmdir` command (or the `rd` command, which is an alias for `rmdir`) to remove the junction point:

    ```
    rmdir "JunctionPointPath"
    ```

    Replace `"JunctionPointPath"` with the full path to the junction point you want to remove. For example:

    ```
    rmdir "C:\WorkArea"
    ```

    If the path contains spaces, be sure to enclose it in quotation marks.

-   **Important:** This command only removes the junction point itself (the directory that acts as the link). It does _not_ delete the contents of the target directory that the junction points to. Those files and directories remain untouched.

**2. Using File Explorer**

-   Open File Explorer.
-   Navigate to the junction point you want to remove.
-   Right-click on the junction point directory.
-   Select "Delete".
-   Confirm the deletion if prompted.

-   **Important:** Just like with the `rmdir` command, deleting the junction point through File Explorer only removes the junction itself, not the contents of the directory it points to.

**Example:**

Let's say you have a junction point at `C:\WorkArea` that points to `C:\MyProject\SourceFiles`.

-   **Using Command Prompt:**

    ```
    rmdir "C:\WorkArea"
    ```

-   **Using File Explorer:**

    1. Open File Explorer.
    2. Navigate to `C:\WorkArea`.
    3. Right-click on the `WorkArea` folder.
    4. Select "Delete".

After performing either of these steps, the `C:\WorkArea` directory (the junction point) will be removed. The files and subdirectories in `C:\MyProject\SourceFiles` will remain intact.

**Error Handling:**

-   If you get an "Access is denied" error, ensure that you are running the Command Prompt as an administrator. You might also need to take ownership of the junction point directory if your user account doesn't have sufficient permissions.

-   If you try to delete the target directory that the junction points to, you'll be deleting the actual files and directories. Be _very_ careful not to accidentally delete the wrong directory! Double-check the path before deleting anything.

**In Summary:**

Junctions are a powerful tool in Windows for creating symbolic directory links within the same volume, providing transparent access to the target directory. They offer a more integrated solution than shortcuts, but are less flexible than symbolic links. Understanding the differences between these link types is crucial for choosing the right one for your needs.