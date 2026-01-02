---
title: Podmany `WARN[0001] "/" is not a shared mount  error
description: Podmany `WARN[0001] "/" is not a shared mount  error
date_created: '2025-08-25T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - podman
---
That `WARN[0001] "/" is not a shared mount, this could cause issues or missing mounts with rootless containers` message is common and generally **not a blocker for your use case (running PostgreSQL in a rootless container in WSL2)**.

Let me explain what it means and why it's usually ignorable in WSL2:

### What the Warning Means

*   **Shared Mounts (or `rshared`):** In Linux, mount propagation describes how mount and unmount events are propagated between mount namespaces. A "shared" mount means that if something is mounted or unmounted in one mount namespace, that event is propagated to other mount namespaces that share it. This is typically configured using `mount --make-rshared /` or similar.
*   **Why Podman Cares:** For advanced rootless container scenarios, especially those involving multiple levels of nested mounts or complex network setups, Podman *sometimes* relies on `rshared` mounts to ensure that all necessary mounts are properly visible and propagated into the container's namespace. Without `rshared`, some specific operations might not work as expected or might lead to "missing mounts."
*   **WSL2 Context:** WSL2's initial mount of the root filesystem (`/`) doesn't typically default to `rshared`. This is a system-level configuration that isn't always enabled by default in non-systemd environments or specific setups like WSL2.

### Why It's Usually Safe to Ignore for Your PostgreSQL Use Case in WSL2

1.  **Simple Volume Mounts:** For a standard PostgreSQL container with a simple volume mount (e.g., `podman run -v pgdata:/var/lib/postgresql/data`), you are just mapping a directory from your host (WSL2 Ubuntu filesystem) into the container. This kind of direct bind mount or named volume **does not typically rely on `rshared` propagation** to function correctly. The volume is directly accessible to the container.

2.  **Rootless Specifics:** While some very specific rootless container behaviors might be affected, running a single, self-contained service like PostgreSQL rarely triggers these edge cases. You're not usually mounting complex, dynamic host directories that need to propagate nested mounts.

3.  **No `systemd` Default:** Many WSL2 distros don't run a full `systemd` init process by default (though newer Ubuntu versions can be configured to, and Docker Desktop's hidden distro does). Configuring `rshared` is often tied into `systemd` unit files or fstab entries. Expecting `rshared` by default in a standard WSL2 shell session without explicit configuration is often unrealistic.

4.  **Common in Non-Systemd/Non-Production Setups:** This warning is frequently seen in various non-production or non-fully-systemd environments where `rshared` isn't globally configured. Users often proceed without issues.

### What to Do:

1.  **Proceed with Caution (but mostly confidence):** You can generally ignore this warning for your PostgreSQL setup.
2.  **Test Thoroughly:** The best way to confirm is to simply run your PostgreSQL container and ensure it functions as expected.
    *   Can you start it?
    *   Can you connect to it?
    *   Does data persist across container restarts (which confirms your volume mount is working)?

    ```bash
    # Try running your postgres container
    podman run -d --name my-postgres \
               -e POSTGRES_DB=my_app_db \
               -e POSTGRES_USER=dev_user \
               -e POSTGRES_PASSWORD=dev_password \
               -v pgdata:/var/lib/postgresql/data \
               -p 5432:5432 \
               postgres:14-alpine

    # Check logs
    podman logs my-postgres

    # Connect from inside WSL2
    psql -h localhost -U dev_user -d my_app_db

    # Stop and start to check persistence
    podman stop my-postgres
    podman start my-postgres
    ```

If these basic functionalities work, then the warning is not impacting your use case.

### When Might it Actually Be an Issue?

*   If you try to mount *another* mount point from within your container that *depends* on the host's propagation behavior.
*   If you're doing very advanced multi-container setups where containers need to dynamically discover mounts created by other processes on the host.

For a single PostgreSQL service, these scenarios are very unlikely.

**In short: Don't worry about it unless you actually encounter unexpected issues with volume mounts or container networking that point to this specific problem.** It's a general warning that doesn't always apply to every rootless container use case.