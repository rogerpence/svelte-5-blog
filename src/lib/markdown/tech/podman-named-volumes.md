---
title: podman named volumes
description: podman named volumes
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-11-03T00:00:00.000Z
date_published: 2026-01-03
pinned: false
tags:
  - containers
---
That's a great question, and it highlights a key difference between named volumes and bind mounts.

The data for a Podman **named volume** (like `postgres_data` you created) is **not stored directly** in an easily accessible folder like `C:\Users\thumb\...` on your Windows host filesystem.

Instead, it's stored:

1.  **Inside the Podman Machine's Filesystem:** Podman on Windows typically runs using a lightweight Linux Virtual Machine (VM). This VM has its own virtual disk and filesystem.
2.  **Managed by Podman:** Within that VM's filesystem, Podman manages a specific directory structure for its storage, including volumes. The typical path _inside the VM_ where volume data is stored is:
    `/var/lib/containers/storage/volumes/<volume_name>/_data`

So, for your `postgres_data` volume, the actual PostgreSQL files would reside at this path _inside the Podman VM_:

`/var/lib/containers/storage/volumes/postgres_data/_data`

**How to Access or Interact with the Volume Data (If Needed):**

-   **Via `podman machine ssh` (Recommended for exploration):** You can access the shell of the Podman VM and navigate to the path:

    ```bash
    # Start an SSH session into the default podman machine
    podman machine ssh

    # Once inside the VM's shell:
    sudo ls -l /var/lib/containers/storage/volumes/postgres_data/_data
    # Or:
    cd /var/lib/containers/storage/volumes/postgres_data/_data
    ls -la
    exit
    ```

    _(You might need `sudo` depending on the VM's configuration)_. This lets you see the files as they exist within the Linux environment where Postgres is actually running.

-   **Mounting into another container:** You can temporarily mount the volume into another utility container (like `alpine` or `ubuntu`) to inspect or copy files using `podman cp`.

    ```bash
    # Run an interactive alpine container with the volume mounted at /inspect
    podman run -it --rm -v postgres_data:/inspect alpine sh

    # Inside the temporary container's shell:
    ls -l /inspect
    # You could tar files here, etc.
    exit
    ```

-   **Backups (Correct Way):** The **best practice** for backing up PostgreSQL data is **not** to copy files directly from the volume location (whether it's a named volume or bind mount), especially while the database is running, as this can lead to inconsistent or corrupt backups. Use standard PostgreSQL tools like `pg_dump` instead:
    ```bash
    # Example: Dump all databases to a file on your host
    podman exec -t postgresdb pg_dumpall -U postgres > C:\Users\thumb\Documents\db_backup.sql
    # (You might need to adjust the user '-U' if you configured a different one)
    ```

**Where is the VM itself stored?**

The VM's virtual disk file (which _contains_ the volume data) is stored on your Windows host, but its exact location depends on the virtualization provider Podman is using (usually WSL or Hyper-V by default):

-   **WSL:** Managed within the WSL distribution's storage (often complex paths under `%LOCALAPPDATA%\Packages`).
-   **Hyper-V:** Typically in the path configured in Hyper-V Manager, often defaulting to somewhere like `C:\ProgramData\Microsoft\Windows\Hyper-V` or `C:\Users\Public\Documents\Hyper-V\Virtual Hard Disks`.

**In Summary:**

Named volumes offer better compatibility and performance by keeping the data within the Linux environment Podman controls. The trade-off is that the data isn't directly browsable via Windows File Explorer. Use `podman machine ssh` for inspection and standard database tools (`pg_dump`) for backups.