---
title: Copy a folder into a new branch
description: Copy a folder into a new branch
date_created: '2025-09-02T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - git
---
Okay, that simplifies things considerably! If the new folder is a complete replacement, you don't care about the history, and you plan to replace `main` entirely, then your initial approach (create branch, empty it, copy contents) is perfectly valid and probably the most direct way to achieve that specific goal.

Here are the steps, refined for your specific intent:

1.  **Ensure your external folder is ready.** Make sure it contains exactly what you want the new `main` branch to look like.

2.  **Navigate to your existing Git repository:**
    ```bash
    cd /path/to/your/git/repo
    ```

3.  **Create and switch to a new branch:** This will be your temporary holding branch for the new content.
    ```bash
    git checkout -b new-main-content
    ```

4.  **Remove all existing tracked files and untracked files/directories (clean slate):**
    *   `git rm -rf .`: Removes all tracked files and directories from the index and working directory.
    *   `git clean -dfx`: Removes all untracked files and directories. The `-f` is force, `-d` includes directories, `-x` includes ignored files. **Use `git clean -df` if you want to keep ignored files.**
    ```bash
    git rm -rf .
    git clean -dfx # Use with caution: this removes everything not tracked by git, including ignored files!
    git commit -m "Cleaned branch for new content"
    ```
    *   **Alternative for step 4 (safer if you're worried about `git clean -dfx`):**
        ```bash
        git rm -rf .
        # Manually delete any remaining untracked files/folders
        # ls -a to see them, then rm -rf them if you want a truly empty dir
        git commit -m "Cleaned branch for new content"
        ```

5.  **Copy the entire contents of your external folder into the repository root:**
    ```bash
    cp -r /path/to/your/external/folder/. . # Copies all files, including dotfiles
    ```
    *   Make sure you copy *from inside* the external folder so its contents are directly in your repo's root, not nested in a new subfolder of the same name. The `.` at the end means "current directory".

6.  **Add all the new files and commit them:**
    ```bash
    git add .
    git commit -m "Imported new project content"
    ```
    Now, your `new-main-content` branch contains exactly what was in your external folder, with its own fresh history.

7.  **Finalize the branch replacement:**

    *   **Option A (Recommended for simplicity): Delete `main` and rename `new-main-content`**
        ```bash
        git checkout main # Switch back to main to delete the branch
        git branch -D main # Force delete the old main branch
        git branch -m main # Rename new-main-content to main
        git push -f origin main # Push the new main branch and overwrite remote
        ```
        **Explanation for `git push -f origin main`:** Since you're replacing the entire history of `main`, you *must* force push to overwrite the remote `main` branch. This is a destructive operation on the remote, so be absolutely sure this is what you want.

    *   **Option B (If you prefer to keep `main`'s name immediately): Reset `main` to `new-main-content`'s state**
        This is a bit more advanced but achieves the same end result.
        ```bash
        git checkout main
        git reset --hard new-main-content # Make main exactly like new-main-content
        git branch -D new-main-content # Delete the temporary branch
        git push -f origin main # Force push to overwrite remote main
        ```
        Again, the force push is crucial here because you are fundamentally altering the history of `main`.

**Before you push:**

*   **Double-check:** After step 6, `git checkout new-main-content` and `ls -a` to verify that the branch truly contains only the content you want.
*   **Backup (Optional but highly recommended):** If this is a critical repository, consider backing up the `.git` folder and the old working directory content before performing the force push, just in case.

This streamlined process directly achieves your goal of completely replacing the `main` branch's content and history with your external folder's content.