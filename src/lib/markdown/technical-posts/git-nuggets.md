---
title: Git nuggets
description: Git nuggets
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - git
---
## To wipe uncommitted changes from a specific file

```
git restore <file_path>
```

## Commit pending changes to a new branch--leave old branch as it was

```
get switch -c newbranch

# Commit changes to the new branck
git cm 'commit changes to the new branch'

# Switch back to main
# This will be clean with no changes pending
git switch main
```


## Test for merge conflicts before committing a branch

```# 1. Ensure your local branches are up-to-date
git fetch origin

# 2. Create a temporary branch from your target branch (e.g., main)
git checkout main                 # Switch to the branch you want to merge INTO
git pull origin main            # Ensure it's up-to-date
git checkout -b temp-merge-check  # Create and switch to a temporary branch

# 3. Try merging your feature branch into this temporary branch
git merge your-feature-branch

# 4. Observe the output.
#    - If it merges cleanly, you're good.
#    - If there are conflicts, Git will tell you. You can inspect them.

# 5. Clean up: Switch back and delete the temporary branch
git checkout main
git branch -D temp-merge-check
```

## What does 'git fetch origin' do

`git fetch origin` is a command that downloads new data from the remote repository named `origin` but **does not integrate any of this new data into your local working branches**.

Let's break it down:

1.  **`git`**: The command-line tool for Git.
2.  **`fetch`**: The specific Git operation. This tells Git to go and get the latest information from a remote repository.
3.  **`origin`**: This is the default conventional name for the remote repository from which your local repository was originally cloned. It's essentially an alias for the URL of your remote repository (e.g., on GitHub, GitLab, Bitbucket). You can have multiple remotes, and `origin` is just the most common one.

**What `git fetch origin` does specifically:**

1.  **Connects to the Remote:** It establishes a connection to the remote repository specified by `origin`.
2.  **Downloads New Data:**
    *   It downloads any **commits** from all branches on `origin` that your local repository doesn't have yet.
    *   It downloads any new **tags** from `origin`.
    *   It updates your local **remote-tracking branches**. These are special local references that act like read-only bookmarks to the state of the branches on the remote repository.
        *   For example, if there's a `main` branch on `origin`, `git fetch origin` will update your local `origin/main` branch to point to the same commit that `main` points to on the remote.
        *   Similarly, for a `feature-x` branch on `origin`, it will update your local `origin/feature-x`.

**What `git fetch origin` does NOT do:**

*   **It does NOT change your current local working branch** (e.g., your local `main`, `develop`, or `feature-x` branch).
*   **It does NOT modify your working directory or staging area.** Your files remain untouched.
*   **It does NOT automatically merge or rebase** the fetched changes into your local branches.

**Why is this useful?**

*   **Safety:** You can see what changes have been made on the remote repository *before* deciding how or if you want to integrate them into your local work.
*   **Inspection:** After fetching, you can:
    *   Compare your local branch with its remote counterpart:
        ```bash
        git log main..origin/main  # See commits on origin/main that aren't on your local main
        git diff main origin/main  # See the differences in content
        ```
    *   Check out a remote branch to inspect it (this creates a new local branch tracking the remote one):
        ```bash
        git checkout feature-x # If origin/feature-x exists, this might create a local feature-x tracking it
        # or more explicitly:
        git checkout -b my-local-copy-of-feature-x origin/feature-x
        ```
*   **Preparation for Merge/Rebase:** Once you've fetched and are happy with the remote changes, you can then integrate them into your local branch using:
    *   `git merge origin/main` (while on your local `main` branch)
    *   `git rebase origin/main` (while on your local `main` branch)

**`git fetch` vs. `git pull`:**

A common point of confusion is the difference between `git fetch` and `git pull`.
*   `git fetch origin` (as described above) only downloads new data.
*   `git pull origin main` is essentially a shortcut for:
    1.  `git fetch origin`
    2.  `git merge origin/main` (if your local `main` is tracking `origin/main` and you're on `main`)
        (or `git rebase origin/main` if configured to do so)

So, `git pull` does the fetch *and then* immediately tries to integrate the changes. Many developers prefer to use `git fetch` first to see what's coming, and then manually `git merge` or `git rebase` for more control.

In summary, `git fetch origin` updates your local "view" of the remote `origin` repository without touching your own local work, allowing you to inspect changes before merging them.

## Is there a way to a dry run with 'git fetch orgin'

Yes, `git fetch` has a `--dry-run` option.

You can use:

```bash
git fetch --dry-run origin
```

or the shorthand:

```bash
git fetch -n origin
```

**What it does:**

This command will connect to the remote repository (`origin` in this case) and report what *would* be fetched (i.e., which remote branches/tags would be updated and to which commit SHAs) **without actually downloading any objects or updating your local remote-tracking branches** (like `origin/main`, `origin/feature-x`, etc.).

**Example Output:**

If there are updates on the remote, the output might look something like this:

```
From <your-remote-url>
   1234567..abcdef0  main       -> origin/main  (would update)
 * [new branch]      feature-y  -> origin/feature-y
 * [new tag]         v1.1       -> v1.1
```

This tells you:
*   The `main` branch on `origin` would be updated from commit `1234567` to `abcdef0`.
*   A new branch `feature-y` would be created locally as `origin/feature-y`.
*   A new tag `v1.1` would be fetched.

If there are no changes, it will typically say something like:

```
From <your-remote-url>
```
or remain silent if there's truly nothing to report.

**Another related command (for seeing remote refs without fetching):**

While not strictly a "dry run" of the *fetch operation itself*, `git ls-remote` can show you the references (branches, tags) on the remote repository without downloading anything beyond that list of references.

```bash
git ls-remote origin
```

This will list all the heads (branches), tags, and other refs on the `origin` remote, along with the commit SHAs they currently point to. You can then manually compare this with your local `origin/*` branches (e.g., `git show-ref origin/main`) to see what a `git fetch` would likely do.

**When to use which:**

*   `git fetch --dry-run origin`: Use this when you want to specifically simulate the `fetch` command and see its intended actions on your remote-tracking branches.
*   `git ls-remote origin`: Use this when you just want a raw listing of what's on the remote, perhaps for scripting or a quick check of a specific branch's SHA on the remote.

For your purpose of a "dry run on 'git fetch origin'", `git fetch --dry-run origin` is the direct answer.