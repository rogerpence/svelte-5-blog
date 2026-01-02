---
title: How to use WSL2 and Podman or Docker for the most performance
description: How to use WSL2 and Podman or Docker for the most performance
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - containers
  - wsl2
---
## Gettting WSL2 up and running

Ensure you are using WSL2

```
wsl --set-default-version 2
```

Install Ubuntu (which is the default install)

```
wsl --install 
```

```
wsl.exe -d ubuntu
```

Install Podman on Unbuntu in WSL2
```
sudo apt update
sudo apt -y install podman
```

Tomorrow night install postgres image and run it with podman



Okay, let's break down the performance considerations for containerized SvelteKit development with your setup. The key performance bottleneck in WSL2 development, especially for Node.js projects like SvelteKit with large `node_modules` directories and frequent file changes (HMR), is **filesystem I/O performance**.

**Understanding the Core Issue:**

-   **Fast:** Accessing files _within_ a WSL2 distro's native Linux filesystem (e.g., ext4) is very fast, near native Linux speed.
-   **Slow:** Accessing files _across_ the Windows/WSL2 boundary (e.g., accessing `/mnt/c/...` from within WSL, or `\\wsl$\...` from Windows) is significantly slower due to the network filesystem protocol (9p) used for this boundary.

**Analyzing Your Setup:**

1.  **Podman Engine Location:** Podman Desktop runs the actual Podman engine (the service that manages containers) inside a dedicated WSL2 distro, which is `podman-machine-default` in your case.
2.  **Container Operations:** When you build (`podman build`) or run (`podman run`) a container, the Podman _engine_ in `podman-machine-default` needs to access the source files (the build context) and potentially mount volumes.
3.  **Pengwin:** Your preferred development environment where you likely have your tools and customizations.

**Evaluating Development Strategies for Performance:**

1.  **Option 1: Code on Windows (`C:\...`), Build/Run via Podman Desktop**

    -   **Workflow:** Edit code on Windows filesystem. Podman Desktop tells the engine in `podman-machine-default` to build/run using code from `/mnt/c/...`.
    -   **Performance:** **Worst.** The Podman engine inside `podman-machine-default` has to constantly read/write files across the slow WSL2/Windows boundary (`/mnt/c`). Builds will be slow, `node_modules` installation within the container (if mapped) will be slow, and Hot Module Replacement (HMR) will be significantly delayed. **Avoid this.**

2.  **Option 2: Code in Pengwin (`/home/user/...`), Build/Run via Podman Desktop**

    -   **Workflow:** Edit code in Pengwin (e.g., using VS Code Remote - WSL connected to Pengwin). Use Podman Desktop (or the `podman` CLI on Windows) which talks to the engine in `podman-machine-default`. The engine needs to access files located in _another_ WSL distro (`\\wsl$\Pengwin\...`).
    -   **Performance:** **Better than Option 1, but still not optimal.** Accessing files between WSL distros is faster than accessing the Windows filesystem, but it still involves inter-distro communication that isn't as fast as accessing files within the _same_ distro. Builds and HMR will be better than option 1, but not the fastest possible.

3.  **Option 3: Code in `podman-machine-default` (`/home/user/...`), Build/Run via Podman Desktop**

    -   **Workflow:** Treat `podman-machine-default` as your development environment. Store your code inside it (e.g., `/home/user/projects/my-svelte-app`). Use VS Code Remote - WSL to connect _directly_ to the `podman-machine-default` distro for editing. Use Podman Desktop (or the CLI within `podman-machine-default`) to build/run.
    -   **Performance:** **Excellent.** The source code and the Podman engine accessing it reside within the _same_ WSL2 distro. All file operations (reading build context, volume mounting for HMR) happen within the fast native Linux filesystem. Builds, dependency installs, and HMR will be significantly faster.
    -   **Downside:** `podman-machine-default` is meant as an appliance. You'll need to install Node.js, git, and any other development tools you need directly into it. It won't have your Pengwin customizations.

4.  **Option 4: Code in Pengwin (`/home/user/...`), Build/Run using Podman _installed natively_ in Pengwin**
    -   **Workflow:** Install `podman` _directly inside Pengwin_ (`sudo apt update && sudo apt install podman` or Pengwin's equivalent). Store and edit code in Pengwin (using VS Code Remote - WSL connected to Pengwin). Run `podman build` and `podman run` commands directly from the Pengwin terminal.
    -   **Performance:** **Excellent.** Just like Option 3, the source code and the Podman engine accessing it are within the same WSL2 distro (Pengwin in this case). File I/O is fast.
    -   **Downside:** Podman Desktop won't automatically manage this Podman instance. You'd primarily interact via the CLI in Pengwin. Podman Desktop would still manage the _other_ engine in `podman-machine-default`, which you wouldn't be using for this workflow.

**Conclusion: The Most Performant Ways**

The most performant approaches are **Option 3** and **Option 4** because they keep the source code files within the same Linux filesystem as the Podman engine that's processing them.

-   **Choose Option 3 (Code in `podman-machine-default`) if:**

    -   You primarily want to use Podman Desktop for management.
    -   You don't mind setting up your development tools (Node, git, etc.) within the `podman-machine-default` distro.
    -   You want the tightest integration with the Podman Desktop ecosystem.
    -   **How:** Connect VS Code Remote - WSL to `podman-machine-default`, clone/create your project there (`/home/user/...`), use Podman Desktop or the `podman` CLI within that distro. Use volume mounts like `-v /home/user/projects/my-svelte-app:/app`.

-   **Choose Option 4 (Code in Pengwin, Podman in Pengwin) if:**
    -   You strongly prefer using your customized Pengwin environment for development.
    -   You are comfortable managing Podman primarily via the command line within Pengwin.
    -   You don't need tight Podman Desktop GUI integration for _this specific_ workflow.
    -   **How:** Ensure `podman` is installed _in Pengwin_. Connect VS Code Remote - WSL to Pengwin, create/clone your project there (`/home/user/projects/...`), run `podman build .` and `podman run -v /home/user/projects/my-svelte-app:/app ...` directly in the Pengwin terminal.

For SvelteKit development where fast HMR and build times are crucial, avoiding the cross-boundary filesystem access (Options 1 and 2) is key.

### I have a Windows 11 PC with WSL2 and Pengwin installed. If I install PodMan in that Pengwin instance, can I create a container in it that maps a port from the container to the host Windows 11 PC? I want to develop web apps in that container and test them in the host's browser.

Yes, absolutely! **You can definitely do this.**
Here's how it works and why:

1.  **Podman inside WSL2:** You install Podman within your Pengwin (or any other WSL2) distribution just like you would on a native Linux system.
2.  **Container Port Mapping:** When you run a container using Podman, you use the `-p` or `--publish` flag to map ports. For example:
    ```bash
    # Inside Pengwin (WSL2)
    podman run -d --name mywebapp -p 8080:80 docker.io/library/nginx
    ```
    This command tells Podman:
    -   Run a container in detached mode (`-d`).
    -   Name it `mywebapp`.
    -   Map port `8080` on the **host** (which in this context is your Pengwin/WSL2 instance) to port `80` inside the **container**.
    -   Use the official Nginx image as an example.
3.  **WSL2 Network Magic (localhostForwarding):** This is the crucial part. WSL2 has a built-in feature often referred to as `localhostForwarding`. When a process inside your WSL2 distribution (like the Podman service managing the port forward) listens on `0.0.0.0:<port>` or `[::]:<port>` (meaning it accepts connections from any interface _within_ WSL2), Windows automatically forwards connections made to `localhost:<port>` on your Windows host machine to that listening port inside the WSL2 instance.
4.  **Accessing from Windows Browser:** Because of this `localhostForwarding`, you can open your web browser on Windows 11 and navigate to:
    ```
    http://localhost:8080
    ```
    Windows will automatically route this request to port `8080` inside your Pengwin WSL2 instance, which Podman will then route to port `80` inside your container.

**In Summary:**

-   You install Podman in Pengwin (WSL2).
-   You run your container using `podman run -p <host_port>:<container_port> ...`. The `<host_port>` refers to the port on the WSL2 instance.
-   WSL2's networking automatically makes services listening within WSL2 accessible via `localhost:<host_port>` on the Windows host.
-   You access your web app from your Windows browser using `http://localhost:<host_port>`.

This is a very common and effective workflow for developing applications using containers within WSL2 and accessing them from the Windows host.

## Installing Docker in WSL2


You've hit on a critical point regarding WSL2 and file system performance! You are absolutely correct to identify that accessing files across the Windows/WSL2 boundary is significantly slower than accessing files purely within the WSL2 filesystem.

This insight fundamentally changes the recommendation for Docker installation if file I/O performance is a primary concern.

### Re-evaluation: Installing Docker Directly in WSL2 Ubuntu (and managing via CLI)

Given your concern about file access speed, installing Docker **directly within your WSL2 Ubuntu distribution** and managing it purely via the CLI (without relying on Docker Desktop's WSL2 integration for the Docker engine itself) becomes the **superior approach for maximum performance and isolation**.

Let me clarify the distinction and why this is the case:

**1. Docker Desktop's WSL2 Backend (Typical Setup):**
*   When you install Docker Desktop on Windows and enable its WSL2 integration, Docker Desktop effectively runs its Docker daemon within a **special, hidden WSL2 distribution** that it manages.
*   When you run `docker` commands from *your* Ubuntu WSL2 distribution, those commands are essentially forwarded to the Docker daemon running in Docker Desktop's managed WSL2 distro.
*   **The key performance bottleneck here is volume mounting:** If you map a Docker volume from a Windows path (e.g., `/mnt/c/Users/YourUser/project:/app`) to a container, or even from your *user* WSL2 distro's path that *itself* is backed by a Windows share, you encounter the slow cross-OS file access.
*   While Docker Desktop tries to optimize this, any I/O that has to traverse the Windows/WSL2 boundary for container volumes will suffer.

**2. Docker Engine Installed Directly in Your WSL2 Ubuntu Distribution (CLI-Managed):**
*   In this scenario, you install the `docker-ce` package directly into your *user-facing* Ubuntu WSL2 distro.
*   The Docker daemon runs as a service *within that same Ubuntu distro*.
*   When you use `docker run` or `docker-compose up` within that Ubuntu terminal, the Docker daemon is local to that environment.
*   **Crucially, when you define Docker volumes, they should point to paths *within that same WSL2 Ubuntu distribution's filesystem*** (e.g., `/home/youruser/myproject/pgdata:/var/lib/postgresql/data`).
*   **Advantage:** All file I/O for your PostgreSQL data and any application code mounted into containers happens **entirely within the high-performance WSL2 ext4 filesystem.** There is no cross-OS file access for container operations, which significantly boosts performance.

### Recommendation Update:

**Yes, you should install the Docker Engine directly into your WSL2 Ubuntu image and manage it via the CLI.**

This is the recommended approach when:
*   File I/O performance (especially for databases like PostgreSQL) is critical.
*   You want the best possible "native Linux" Docker experience within WSL2.
*   You're primarily working within the WSL2 environment for your development.

### Steps for Installing Docker Engine Directly in WSL2 Ubuntu:

1.  **Ensure you *don't* have Docker Desktop running and integrated with your specific Ubuntu WSL2 distro, or at least disable that integration if it is.** (It's generally fine to have Docker Desktop for other things, but your WSL2 Ubuntu will run its own Docker daemon).

2.  **Open your WSL2 Ubuntu terminal.**

3.  **Update your package list:**
    ```bash
    sudo apt update
    sudo apt upgrade
    ```

4.  **Install necessary packages for Docker:**
    ```bash
    sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
    ```

5.  **Add Docker's official GPG key:**
    ```bash
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    ```

6.  **Verify that you now have the key with the fingerprint `9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88`:**
    ```bash
    sudo apt-key fingerprint 0EBFCD88
    ```

7.  **Add the Docker APT repository:**
    ```bash
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    ```

8.  **Update your package list again (to include Docker packages):**
    ```bash
    sudo apt update
    ```

9.  **Install Docker Engine, containerd, and Docker Compose:**
    ```bash
    sudo apt install docker-ce docker-ce-cli containerd.io docker-compose
    ```

10. **Add your user to the `docker` group (so you don't need `sudo` for every Docker command):**
    ```bash
    sudo usermod -aG docker $USER
    ```
    *You'll need to close and reopen your WSL2 terminal for this change to take effect.*

11. **Start the Docker service:**
    ```bash
    sudo service docker start
    ```
    (Or `sudo systemctl start docker` if `systemctl` is available in your WSL2 setup, which it usually is in newer Ubuntu versions.)

12. **Verify Docker is running:**
    ```bash
    docker run hello-world
    ```
    You should see a message indicating Docker is working.

Now, when you use `docker-compose` for PostgreSQL, ensure your `volumes` section points to paths within your WSL2 `~` directory (e.g., `~/my_project/pgdata`).

**Example `docker-compose.yml` for this setup:**

```yaml
version: '3.8'

services:
  db:
    image: postgres:14-alpine
    restart: always
    environment:
      POSTGRES_DB: my_app_db
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: dev_password
    volumes:
      # This volume path is relative to the docker-compose.yml location
      # and will resolve to a directory within your WSL2 Ubuntu filesystem.
      - ./pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  pgdata: # This defines a named volume, which Docker creates/manages
          # internally within the WSL2 filesystem, leading to optimal performance.
          # Alternatively, you can use a bind mount like - /home/youruser/pg_data:/var/lib/postgresql/data
          # but named volumes are generally preferred for persistence.
```

By installing Docker directly in your WSL2 Ubuntu image, you get the best of both worlds: the isolation and portability of Docker, combined with the native file system performance of WSL2's Linux environment.

## Podman alternative

Yes, **Podman is absolutely a rational and often advantageous alternative to Docker in this specific WSL2 scenario**, especially if you're concerned about resources and system-level daemon overhead. Since you're already familiar with Docker, the transition to Podman is remarkably smooth.

Let's break down why Podman is a strong contender here:

### Key Advantages of Podman over Docker (especially in a WSL2 CLI-managed context):

1.  **Daemonless Architecture:** This is the biggest differentiator. Podman does not use a persistent background daemon like Docker. When you run a `podman run` command, the container process is forked directly from the Podman client.
    *   **Benefit in WSL2:** No Docker daemon means fewer background processes running, less memory consumption for the daemon itself, and potentially a lighter footprint on your WSL2 instance.
    *   **No `sudo` for Rootless Containers:** A major Podman feature is rootless containers. You can run containers as your unprivileged user, which is a significant security improvement and also means you don't need `sudo` to run most `podman` commands (after initial setup).

2.  **OCI Compliant:** Podman adheres to the Open Container Initiative (OCI) standards for container images and runtimes. This means it can run the exact same images you'd use with Docker.
    *   **Familiarity:** Your existing `postgres:14-alpine` image will work seamlessly.

3.  **Docker CLI Compatibility:** Podman's CLI is designed to be largely command-for-command compatible with Docker's CLI.
    *   **Ease of Transition:** Most of your `docker` commands (e.g., `docker run`, `docker ps`, `docker images`, `docker stop`) can simply be replaced with `podman` (e.g., `podman run`, `podman ps`, `podman images`, `podman stop`).
    *   **`podman-compose`:** There's a `podman-compose` tool that aims to replicate `docker-compose` functionality, allowing you to use your existing `docker-compose.yml` files (with minor adjustments sometimes).

4.  **Security Focus:** Rootless containers improve security by not requiring elevated privileges for most container operations. If a container is compromised, the attacker only has the privileges of your user, not root.

5.  **Buildah Integration:** Podman often pairs with Buildah for building images, offering more granular control than `docker build` but `podman build` also exists for simple Dockerfile builds.

### Disadvantages/Considerations for Podman in WSL2:

1.  **Systemd Integration (minor):** While Docker Desktop uses `systemd` in its hidden WSL2 distro, your user-facing WSL2 Ubuntu might not run `systemd` by default (it depends on your Ubuntu version and how you launch it). Podman works fine without it, but some advanced features like running containers as "system services" might need specific configuration if you want them to auto-start. However, for simple dev containers like PostgreSQL, it's not an issue.
2.  **`podman-compose` vs `docker-compose`:** While `podman-compose` exists and works well, it's a separate project and might occasionally lag behind `docker-compose` in terms of features or bug fixes. For basic service definitions like PostgreSQL, it's usually fine.
3.  **Initial Setup for Rootless:** While simpler in the long run, setting up rootless containers with Podman involves a few extra steps (like `subuid`/`subgid` configuration) compared to just installing Docker. However, these are usually well-documented.

### Practical Steps for Podman in WSL2 Ubuntu:

1.  **Install Podman:**
    ```bash
    sudo apt update
    sudo apt install podman podman-compose
    ```
    *Note: `podman-compose` might not always be in the main repos for all Ubuntu versions, you might need to add a PPA or install it via `pip`.* If `podman-compose` isn't available, you can still use basic `podman run` commands for your PostgreSQL setup.

2.  **Configure for Rootless Containers (Optional but Recommended):**
    Podman usually handles this automatically on first run, but if you encounter issues with rootless, you might need to ensure your user has entries in `/etc/subuid` and `/etc/subgid`.
    ```bash
    # This command attempts to create the necessary entries if they don't exist
    podman system migrate
    ```

3.  **Start PostgreSQL:**
    *   **Using `podman run` (simple, no `podman-compose` needed for a single service):**
        ```bash
        podman run -d --name my-postgres \
                   -e POSTGRES_DB=my_app_db \
                   -e POSTGRES_USER=thumb \
                   -e POSTGRES_PASSWORD=thumb \
                   -v pgdata:/var/lib/postgresql/data \
                   -p 5432:5432 \
                   postgres:17-alpine
        ```
        This command directly translates from Docker. `pgdata` here creates a Podman managed volume in your WSL2 environment, ensuring performance.

    *   **Using `podman-compose` (with your `docker-compose.yml`):**
        Navigate to your directory with the `docker-compose.yml` and run:
        ```bash
        podman-compose up -d
        ```

### Conclusion: Is it rational? Yes!

If you're already familiar with Docker, switching to Podman in a CLI-managed WSL2 environment is a very rational and often superior alternative, especially for resource efficiency and security. The mental model and most CLI commands are almost identical.

It allows you to fully leverage the performance benefits of WSL2's native filesystem for your containerized applications without the overhead of the Docker daemon or the potential performance penalties of Docker Desktop's cross-OS volume mounts.

Given your concern about file access speed and your familiarity with Docker, I would highly encourage you to **try Podman**. It's a very straightforward transition for your use case and often leads to a lighter, more performant developer experience within WSL2.


Had to resolve this with:
 Error: exec: "qemu-system-x86_64":
 with:
sudo apt install qemu-system-x86 podman-remote

## Add search registries

sudo nano /etc/containers/registries.conf

```
[registries.search] 
registries = ['docker.io', 'quay.io']
```