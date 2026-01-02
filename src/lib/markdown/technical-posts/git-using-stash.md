---
title: Git - using stash
description: Git - using stash
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - git
---
A brief guide to using `git stash`:

**What is `git stash`?**

`git stash` temporarily shelves (or stashes) your uncommitted changes (both staged and unstaged) in your working directory. This lets you quickly switch context (e.g., to another branch, pull updates) without making a premature or messy commit.

**Why Use It?**

-   **Quickly switch branches:** You're working on Feature A, but an urgent bug fix is needed on `main`. Stash your changes, switch to `main`, fix, then switch back and unstash.
-   **Pull remote changes:** You have local changes, but you need to `git pull`. Stashing avoids potential merge conflicts with your uncommitted work.
-   **Clean working directory:** Need to run tests or a build on a clean state without committing.

**Core Workflow:**

1.  **Stashing Your Changes:**

    -   `git stash`: Stashes tracked files that are modified or staged. Untracked files are _not_ stashed by default.
    -   `git stash save "Your descriptive message"`: Same as above, but adds a message to your stash, making it easier to identify later. **(Recommended)**

2.  **Viewing Your Stashes:**

    -   `git stash list`: Shows all your stashes, with the most recent at the top (e.g., `stash@{0}`, `stash@{1}`, etc.).

3.  **Applying Your Stash:**
    -   `git stash pop`: Applies the most recent stash (`stash@{0}`) and then **removes it** from the stash list. Use this if you're confident you want the changes back and don't need the stash entry anymore.
    -   `git stash apply`: Applies the most recent stash (`stash@{0}`) but **keeps it** in the stash list. Useful if you want to apply the same changes to multiple branches or just want to test them.
    -   `git stash pop stash@{2}` or `git stash apply stash@{2}`: Applies a specific stash from the list (replace `2` with the desired index).

**Useful Options & Commands:**

-   **Stashing Untracked Files:**
    -   `git stash -u` or `git stash --include-untracked`: Stashes modified, staged, AND untracked files.
-   **Stashing All Files (including ignored):**
    -   `git stash -a` or `git stash --all`: Stashes everything: modified, staged, untracked, AND ignored files. Use with caution.
-   **Stashing Specific Files:**
    -   `git stash -- <file1.txt> <path/to/file2.py>`: Stashes only the specified files/paths.
-   **Viewing Stash Contents:**
    -   `git stash show stash@{0}`: Shows a summary of changes in the specified stash.
    -   `git stash show -p stash@{0}`: Shows the full diff (patch) of the specified stash.
-   **Creating a Branch from a Stash:**
    -   `git stash branch <new-branch-name> [stash@{n}]`: Creates a new branch based on the commit your stash was created from, applies the stash, and then drops the stash if successful. Great for turning stashed work into a proper feature branch.
-   **Deleting Stashes:**
    -   `git stash drop [stash@{n}]`: Deletes a specific stash (e.g., `stash@{1}`). If no stash is specified, it deletes the latest (`stash@{0}`). Use this if you've `apply`'d a stash and are sure you don't need it.
    -   `git stash clear`: Deletes ALL stashes. **Use with extreme caution!**

**Quick Tips:**

-   **Always try to `git stash save "message"`:** Descriptive messages save you headaches later.
-   **Don't let stashes accumulate:** They are temporary. If work is significant, commit it to a feature branch.
-   **Stashes are local:** They are not pushed to the remote repository with `git push`.
-   **Conflicts can happen:** If the branch has diverged significantly since you stashed, you might encounter conflicts when applying the stash. Resolve them like regular merge conflicts.

`git stash` is a powerful tool for managing work-in-progress. Use it wisely to keep your workflow clean and efficient!