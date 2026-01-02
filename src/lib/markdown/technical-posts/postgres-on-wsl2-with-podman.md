---
title: Postgres on WSL 2 with Podman
description: How to install and configure Postres on WSL2 with Podman
date_updated: 2025-12-29
date_created: 2025-02-02
date_published:
pinned: false
tags:
  - containers
  - podman
  - postgres
---

[[supabase-credentials#This is a test]]

```powershell
/home/user/postgres_data
/home/user/postgres_storage
```

See 9:40 in Scott's video for this connection URL

![[image-68.png]]

These are the commands that worked

```powershell
podman volume create pg_data_final

podman run -d --name postgres-wsl  
-e POSTGRES_PASSWORD=mysecretpassword -e PGDATA=/var/lib/postgresql/data  
-v pg_data_final:/var/lib/postgresql/data:Z -p 5432:5432  
--shm-size=1g postgres:latest  
-c shared_buffers=512MB `  
-c random_page_cost=1.1
```

  It is great to hear you are up and running! This setup is a very good setup for running a database on Windows 11 via WSL 2 because it prioritizes native I/O speed while navigating the strict permission rules of rootless Podman. This setup's named volume keeps all DB data on the WSL 2-hosted VM. 

Here is a recap of the logic and steps that led to this successful, high-performance configuration:

### 1. The Environment Reset
We started by clearing out "phantom" WSL distributions. When a WSL distro is deleted manually, Podman’s internal metadata gets out of sync. 
*   **The Fix:** Running `podman machine rm -f` and `podman machine init` created a clean, fresh WSL 2 backend dedicated to Podman.

### 2. Solving the "Slow Disk" Problem
You correctly identified that mounting Windows folders (like `C:\Users\...`) is extremely slow. This is because every database write has to cross the "9P" bridge between Linux and Windows.
*   **The Fix:** We used a **Named Volume** (`pg_data_final`). Unlike a direct folder mount, a named volume is managed entirely by Podman inside the WSL `ext4` virtual disk. This allows Postgres to write to the disk at native SSD speeds.

### 3. Overcoming Postgres 18 Permission Errors
Postgres 18 introduced a new logic that tries to create a `/18/data` subdirectory inside your mount. In a "rootless" Podman environment, the container user doesn't have system permission to create new directories on a volume root, which caused the `Permission Denied` errors.
*   **The Fix:** We used `-e PGDATA=/var/lib/postgresql/data`. This told Postgres: *"Don't try to create a new versioned folder; use this exact path I've provided."* This bypassed the failing `mkdir` command.

### 4. Performance Tuning for Modern Hardware
Standard Postgres images are configured conservatively to run on old servers with spinning hard drives.
*   **The Fix:** We injected high-performance flags directly into the `run` command:
    *   `--shm-size=1g`: Gave Postgres enough shared memory to handle complex queries.
    *   `shared_buffers=512MB`: Allocated 25% of your assigned RAM to the database cache.
    *   `random_page_cost=1.1`: Told the Postgres query planner that you are using an **SSD**, making it much faster at choosing the right indexes.

---

### Maintenance Cheat Sheet
Now that you have this working, here are the three commands you’ll likely need in the future:

**To stop/start the database:**
```powershell
podman stop postgres-wsl
podman start postgres-wsl
```

**To see if it's running healthy:**
```powershell
podman ps
podman logs postgres-wsl
```

**To enter the database command line directly (psql):**
```powershell
podman exec -it postgres-wsl psql -U postgres
```

**A note on Windows Restarts:** 
If you restart your computer, you will need to run `podman machine start` first, and then `podman start postgres-wsl` to get your database back online. Your data will be exactly where you left it inside that named volume!


## More help

When you run `podman stop postgres-wsl`, you are stopping **only the container**.

To understand exactly what is happening in your specific setup, it helps to look at the "layers" you have running. Think of it like a Russian nesting doll:

### 1. The Container (`postgres-wsl`) 
This is the "process" of PostgreSQL itself. When you run `podman stop`, you are telling the Postgres engine to perform a graceful shutdown. 
*   **Status:** "Exited."
*   **Data:** Safe. It stays in the `pg_data_final` volume.
*   **Resources:** It stops using CPU and RAM.

### 2. The Podman Engine (The "Machine") 
Behind the scenes, you have a WSL 2 distribution (the `podman-machine-default` you saw earlier) that acts as the host for your containers. 
*   **Status:** "Running."
*   **Note:** Even though the container is stopped, the Linux VM (WSL) is still powered on and idling in the background, waiting for you to start a container again.

### 3. WSL 2/Windows 11 
The overall Windows subsystem for Linux is still active.

---

### Why this distinction matters:

#### If you want to save RAM on your computer:
Stopping the container helps a little, but the **Podman Machine** (the Linux VM) usually reserves a chunk of your Windows RAM (you saw it was using 4GiB earlier). To get that RAM back, you have to stop the "Machine":
```powershell
podman machine stop
```

#### If you want to resume work:
If you only stopped the **container**, you only need one command to get back into DBeaver:
```powershell
podman start postgres-wsl
```

If you stopped the **machine** or **restarted Windows**, you need two steps:
1. `podman machine start` (Turn on the Linux engine)
2. `podman start postgres-wsl` (Turn on the Postgres process)

### Summary
`podman stop postgres-wsl` = **Turning off the App.**
`podman machine stop` = **Turning off the Computer the app runs on.**
## 

To answer your question directly: **No, it does not map to a folder on your Windows host.**

This is exactly why your database is now performing so well. Here is the breakdown of where that data actually lives and how it works:

### 1. Where is the data?
The data lives inside the **WSL 2 Virtual Disk (`.vhdx`)**. 

When you created the named volume `pg_data_final`, Podman carved out a directory inside the Linux file system that belongs to your `podman-machine-default` instance. To Windows, that entire Linux environment is just one giant, high-performance file (usually located at `%USERPROFILE%\AppData\Local\Microsoft\Windows\WSL\...`).

### 2. Does it contain the database data?
**Yes.** Everything that makes up your Postgres database is inside that volume:
*   Your tables and actual row data.
*   Your indexes and schemas.
*   The Postgres configuration files.
*   The transaction logs (WAL).

### 3. Can I see the files from Windows?
You can actually "peek" into the volume from Windows Explorer, but you should **never** move or edit these files from Windows, or you will corrupt the database permissions.

If you want to see them, paste this into your Windows Explorer address bar:
`\\wsl$\podman-machine-default\home\user\.local\share\containers\storage\volumes\pg_data_final\_data`

*(Note: The exact path might vary slightly depending on your Podman version, but it is always inside the `\\wsl$` network share.)*

### 4. Why this is the "Performance Secret"
*   **No "Bridge" Tax:** When Postgres writes to a Windows folder (like `C:\Users`), it has to use a translation layer called **9P**. This layer acts like a slow network translator between Linux and Windows. It is death for database performance.
*   **Native Linux Speed:** By using a Named Volume, Postgres talks directly to the **ext4** filesystem. There is no translation. It’s as fast as running Postgres on a dedicated Linux server.

### 5. How do I back it up?
Since the files aren't in a standard Windows folder, you can't just "Copy+Paste" them to a USB drive easily. If you want to back up your data, you have two professional options:

**Option A: The SQL Dump (Safest)**
Run this from PowerShell to create a backup file on your Windows Desktop:
```powershell
podman exec postgres-wsl pg_dumpall -U postgres > C:\Users\YourUsername\Desktop\backup.sql
```

**Option B: The Podman Export**
You can export the entire volume to a compressed file:
```powershell
podman volume export pg_data_final --output pg_backup.tar
```

### Summary
Your data is stored in a **high-speed virtual vault** inside WSL 2. It is not on your "Host" Windows filesystem, which is exactly why you are no longer seeing the slowness you experienced before!

## Successful steps!

This is the "Golden Path" we discovered to get high-performance PostgreSQL running on Windows 11 via Podman and WSL 2. 

By following these steps, you moved the database from the slow Windows filesystem into the native Linux environment, bypassing permission errors and performance bottlenecks.

### Step 1: Environment Cleanup & Reset
We first had to ensure Podman's background engine (the WSL "machine") was healthy and in sync.
*   **The Problem:** Old or manually deleted WSL distros leave "phantom" metadata that makes Podman fail to start.
*   **The Fix:** You removed the broken machine and initialized a fresh one with enough resources:
```powershell
podman machine rm -f podman-machine-default
podman machine init --disk-size 50 --memory 4096
podman machine start
```

### Step 2: Using a performant storage strategy
You originally had Postgres pointing to a folder on your Windows `C:\` drive, which was slow.
*   **The Change:** We switched from a "Bind Mount" (a Windows folder) to a **Podman Named Volume**.
*   **The Result:** This placed the data inside the WSL `ext4` filesystem. This eliminates the **9P protocol overhead**, allowing your SSD to perform at native Linux speeds.
```powershell
podman volume create pg_data_final
```

### Step 3: Resolving Postgres 18 Permission Errors
Postgres 18 changed its storage logic to use versioned subdirectories (e.g., `/var/lib/postgresql/18/data`). In a rootless Podman environment, this caused a "Permission Denied" error because the container couldn't create new directories on the root of the volume.
*   **The Solution:** We used the **`PGDATA` override**. By explicitly setting the path, we told Postgres to skip the directory-creation logic and use the volume mount point directly.

### Step 4: The Final Performance-Tuned Run Command
This specific command combined the storage fix with engine tuning for modern SSDs:

```powershell
podman run -d `
  --name postgres-wsl `
  -e POSTGRES_PASSWORD=mysecretpassword `
  -e PGDATA=/var/lib/postgresql/data `
  -v pg_data_final:/var/lib/postgresql/data:Z `
  -p 5432:5432 `
  --shm-size=1g `
  postgres:latest `
  -c shared_buffers=512MB `
  -c random_page_cost=1.1
```

**Why these flags matter:**
*   **`-v ...:Z`**: Automatically handles the internal Linux security labels so Postgres can read/write to the volume.
*   **`--shm-size=1g`**: Increases the shared memory limit. Without this, Postgres often crashes on complex queries in containers.
*   **`-c random_page_cost=1.1`**: Tells Postgres you are on an **SSD**. By default, Postgres assumes you have a slow, spinning hard drive and avoids using certain indexes. This flag makes it much faster.

### Step 5: Connecting DBeaver via the Localhost Relay
Because Podman on Windows runs inside a specialized WSL VM, it uses a "proxy" to connect that VM to your Windows network.
*   **The Result:** You were able to connect DBeaver using `localhost:5432` because Podman automatically forwarded the traffic from Windows into the WSL container.

### Summary of the "Wins":
1.  **Speed:** Native `ext4` storage via a Named Volume.
2.  **Stability:** Overrode `PGDATA` to fix Postgres 18 directory permission issues.
3.  **Optimization:** Tuned for SSDs and allocated proper shared memory.
4.  **Cleanliness:** Removed old, failed containers and volumes to keep the system tidy.

You now have a professional-grade PostgreSQL setup that is significantly faster and more reliable than a standard Windows-native installation or a basic Docker-on-Windows setup.
## -f flag

You don't **need** it for the database to function, but since your goal is **high performance**, it is a very good flag to have. 

Here is the breakdown of why you might care about it and whether it’s worth "fixing" your current container to include it.

### What does `effective_io_concurrency` do?
This setting tells PostgreSQL how many simultaneous disk I/O operations the underlying storage can handle at once. 
*   **Default (1):** Assumes a single spinning hard drive platter. Postgres waits for one piece of data to be read before asking for the next.
*   **High Value (200-300):** Optimized for **SSDs**. Since SSDs don't have a physical "head" that has to move, they can fetch dozens of different pieces of data simultaneously. 

By setting this to `200`, you are telling the Postgres query planner: *"Don't be shy; feel free to initiate up to 200 I/O requests at once."* This dramatically speeds up **Bitmap Heap Scans** (a common way Postgres reads data when using indexes).

### Do you care?
*   **For Development/Small Data:** You won't notice the difference. The database is already very fast because it’s on the WSL native filesystem.
*   **For Large Data/Complex Queries:** You **do** care. It allows Postgres to fully saturate the speed of your NVMe/SSD.

### How to add it 
Because this is a startup flag, you cannot add it to a running container. You would have to recreate it. Since your data is safe in the **Volume**, this only takes 30 seconds:

1.  **Stop and Remove the current container:**
    ```powershell
    podman stop postgres-wsl
    podman rm postgres-wsl
    ```

2.  **Run it again with the "Ultimate" performance flags:**
```powershell
podman run -d `
  --name postgres-wsl `
  -e POSTGRES_PASSWORD=mysecretpassword `
  -e PGDATA=/var/lib/postgresql/data `
  -v pg_data_final:/var/lib/postgresql/data:Z `
  -p 5432:5432 `
  --shm-size=1g `
  postgres:latest `
  -c shared_buffers=512MB `
  -c random_page_cost=1.1 `
  -c effective_io_concurrency=200 `
  -c work_mem=16MB
```

### Summary
If you are happy with the current speed in DBeaver, **leave it as is.** You’ve already fixed the biggest bottleneck (moving from Windows storage to WSL storage). 

However, if you want to brag that your Postgres is tuned exactly for modern SSD hardware, adding `effective_io_concurrency=200` is the "cherry on top" for your configuration!

## Does that named volume persist as long as the WSL distro is installed

The short answer is **yes**, the named volume persists as long as the **Podman Machine** (which is a WSL distribution) exists. 

However, because you are using Podman on Windows, there is a specific hierarchy of "persistence" you should understand to ensure you never accidentally lose your data.

### 1. What IS safe (Data Persists)
Your data in `pg_data_final` will survive all of the following:
*   **Stopping/Starting the container:** `podman stop` / `podman start`.
*   **Deleting the container:** `podman rm`.
*   **Restarting Windows:** When you reboot, the WSL virtual disk stays on your drive.
*   **Stopping the Podman Machine:** `podman machine stop`.
*   **Updating the Postgres Image:** If you pull a newer version of Postgres and recreate the container using the same volume, your data remains.

### 2. What IS NOT safe (Data is Lost)
Your data will be destroyed if you do any of the following:
*   **`podman machine rm`**: If you delete the Podman Machine to "start fresh," you are deleting the entire WSL virtual disk, including all volumes stored inside it.
*   **`podman volume rm pg_data_final`**: This is the specific command to delete the virtual hard drive you created.
*   **Uninstalling WSL or Podman Desktop**: Depending on the settings, removing the application may trigger a cleanup of the associated WSL distributions.
*   **Factory Resetting Windows**: This obviously wipes the WSL subsystem.

### 3. Where exactly is the "Risk"?
In a standard Linux setup, the volume is just a folder on your physical disk. In your Windows setup, the volume is a folder **inside a virtual disk file** (`.vhdx`). 

If that `.vhdx` file (the `podman-machine-default` distribution) is deleted, the volume goes with it.

---

### Pro-Tip: The "Golden Rule" of Database Persistence
While named volumes are great for performance and daily development, **never rely on a container volume as your only backup** for important data. 

Because WSL distributions can occasionally become corrupted or need to be recreated (as we did in Step 1 of your setup), you should occasionally "export" your data to the **Windows Host** side where your standard PC backups (like OneDrive, Backblaze, or an external drive) can see it.

**The "Safety" Command (Run this once a week):**
```powershell
podman exec postgres-wsl pg_dumpall -U postgres > C:\Users\YourName\Documents\postgres_backups\weekly_backup.sql
```
*This takes the data **out** of the virtual WSL world and puts it into a standard Windows file that will survive even if you delete the Podman Machine.*

### Summary
As long as you don't run `podman machine rm`, your Postgres data is as permanent as any other file on your computer. It is stored safely inside the WSL filesystem, optimized for the high performance you've now achieved.

## Podman command summary

Here is a concise cheat sheet of the most useful Podman commands and flags for managing your new PostgreSQL environment and beyond.

### 1. Essential Container Commands
| Command | Purpose |
| :--- | :--- |
| `podman ps` | List **running** containers. |
| `podman ps -a` | List **all** containers (including stopped/crashed ones). |
| `podman logs <name>` | View the output of a container (add `-f` to follow live). |
| `podman stop <name>` | Gracefully shut down a container. |
| `podman start <name>` | Start an existing, stopped container. |
| `podman rm -f <name>` | Forcefully delete a container. |
| `podman exec -it <name> bash` | Enter a container's terminal while it is running. |
| `podman inspect <name>` | View the full technical configuration (JSON format). |

---

### 2. Common `podman run` Flags
These are the building blocks of the "Run" script you used:
*   **`-d`** (Detached): Runs the container in the background.
*   **`-p 5432:5432`**: Maps a host port to a container port (`Host:Container`).
*   **`--name <my_name>`**: Assigns a friendly name so you don't have to use long IDs.
*   **`-e VAR=val`**: Sets environment variables (e.g., `POSTGRES_PASSWORD`).
*   **`--rm`**: Automatically deletes the container when it stops (great for one-off tests).
*   **`-it`**: Keeps the terminal interactive (used for `bash` or `psql`).
*   **`--restart <policy>`**: Set to `always` or `unless-stopped` to auto-restart if it crashes.
*   **`--shm-size=1g`**: Increases shared memory (crucial for databases like Postgres).

---

### 3. Special Volume Suffixes
In Podman, the flags appended to your volume (`-v volume_name:path:suffix`) are critical for rootless environments:
*   **`:z`**: (Lower-case) Tells SELinux the volume is **shared** between multiple containers.
*   **`:Z`**: (Upper-case) Tells SELinux the volume is **private** to this container only.
*   **`:U`**: Tells Podman to **map the ownership** of the host files to the container’s internal user (fixes "Permission Denied" errors in rootless mode).

---

### 4. Image & Storage Management
| Command | Purpose |
| :--- | :--- |
| `podman images` | List all downloaded images. |
| `podman pull <image>` | Download the latest version of an image from a registry. |
| `podman rmi <id>` | Delete an image from your drive. |
| `podman volume ls` | List all named volumes (the virtual hard drives). |
| `podman volume prune` | **Danger:** Deletes all volumes not currently attached to a container. |

---

### 5. Windows/WSL "Machine" Commands
Since you are on Windows, you are managing the Linux "engine" that runs Podman:
*   **`podman machine ls`**: Check the status of your WSL backend (Running vs. Stopped).
*   **`podman machine start`**: Power on the Linux VM.
*   **`podman machine stop`**: Power off the VM (saves Windows RAM).
*   **`podman machine ssh`**: Log directly into the Linux VM backend.
*   **`podman machine set --cpus 4 --memory 4096`**: Resize the engine's resources.

---

### 6. System Health & Maintenance
*   **`podman stats`**: View live CPU and RAM usage of your containers.
*   **`podman info`**: View system-wide settings, storage paths, and registry info.
*   **`podman system prune -a`**: The "Spring Cleaning" command. Deletes all stopped containers, unused networks, and dangling images.

## Shutdown and startup 

Because your data is stored in a **Named Volume** (`pg_data_final`), the data is physically separated from the container's lifecycle. You can stop, start, or even delete the container without losing a single row of data.

Here is the professional workflow for shutting down and starting back up.

---

### Part 1: Shutting Down Safely
To ensure your database files are closed correctly and your Windows RAM is freed up, follow these two steps:

**1. Stop the Postgres Container**
This sends a signal to Postgres to flush all pending data to the disk and close connections gracefully.
```powershell
podman stop postgres-wsl
```

**2. Stop the Podman Machine (The RAM Saver)**
Even if the container is stopped, the WSL 2 Linux VM is still running in the background, consuming a few gigabytes of your Windows RAM. Run this to fully "turn off" the engine:
```powershell
podman machine stop
```

---

### Part 2: Starting Up (After a Reboot)
When you turn your PC back on, the Podman engine does not start automatically. You must bring the environment back up in this order:

**1. Start the Podman Machine**
This "boots" the hidden Linux environment that holds your Podman volumes and engine.
```powershell
podman machine start
```

**2. Start the Postgres Container**
Once the machine is "Started," run your container. You don't need the long `run` command with all the flags; Podman remembered them all when you first created it.
```powershell
podman start postgres-wsl
```

**3. Verify Health**
Wait about 5 seconds for Postgres to finish its internal checks, then verify it's ready:
```powershell
podman logs postgres-wsl
```
*Look for: "database system is ready to accept connections."*

---

### Bonus: The "Easy Button" (Automation)
If you don't want to type these every time you reboot, you can create a simple **Startup Script** on your Windows Desktop.

1.  Right-click your Desktop and select **New > Text Document**.
2.  Paste the following:
 ```batch
 @echo off
  echo Starting Podman Machine...
 podman machine start
 echo Starting Postgres Container...
 podman start postgres-wsl
 echo.
 echo Done! Your database is ready for DBeaver.
 pause 
```

1.  Save the file as **`Start-Postgres.bat`** (make sure it ends in `.bat`, not `.txt`).

Now, after a reboot, you just **double-click that file**, and your high-performance Postgres environment will spin up automatically!

### Why your data is safe:
When you run `podman stop` or `podman machine stop`, the data inside the `pg_data_final` volume remains exactly where it is on the WSL virtual disk. It is exactly like turning off a computer; the files on the hard drive don't disappear just because the power is off.

## Full system shutdown

To fully restart the entire stack—from the database engine up to the Windows Subsystem for Linux itself—you should follow a "top-down" shutdown and a "bottom-up" startup. 

This is the most reliable way to clear memory leaks, reset "stuck" network ports, and ensure your virtual disk is in a safe state.

### Phase 1: The Clean Shutdown (Top-Down)
This sequence ensures Postgres finishes its writes before the underlying "computer" is turned off.

1.  **Stop the Container:**
    ```powershell
    podman stop postgres-wsl
    ```
2.  **Stop the Podman Machine:**
    ```powershell
    podman machine stop
    ```
3.  **Shutdown WSL Entirely:**
    This command kills **all** running WSL distributions and the background WSL 2 lightweight utility VM. Use this if WSL feels sluggish or if you are having connection issues.
    ```powershell
    wsl --shutdown
    ```

---

### Phase 2: The Fresh Start (Bottom-Up)
You don't need a specific "WSL start" command; starting the Podman machine will automatically trigger the WSL 2 subsystem to wake up.

1.  **Start the Podman Machine:**
    ```powershell
    podman machine start
    ```
    *(If this hangs, it’s usually because Windows is still cleaning up the previous WSL shutdown; just wait 10 seconds and try again.)*

2.  **Start the Container:**
    ```powershell
    podman start postgres-wsl
    ```

---

### Why should you use `wsl --shutdown`?
In your specific environment, `wsl --shutdown` is a powerful tool for two reasons:

*   **Memory Reclamation:** WSL 2 (and Podman by extension) is notorious for "holding onto" Windows RAM even after you stop a container. A full shutdown forces the `vmmem` process in Task Manager to release that memory back to Windows.
*   **Networking Reset:** If DBeaver suddenly stops connecting to `localhost`, a WSL shutdown resets the virtual network bridge between Windows and Linux, which usually fixes the issue.

### The "Full Restart" Script
If you want to do this frequently to keep your system fast, you can put this into a `.bat` file:

```batch
@echo off
echo --- SHUTTING DOWN ---
podman stop postgres-wsl
podman machine stop
wsl --shutdown
echo.
echo --- RESTARTING ---
podman machine start
podman start postgres-wsl
echo.
echo System Restarted Successfully.
pause
```

### Is my data safe during `wsl --shutdown`?
**Yes.** As long as you ran `podman stop postgres-wsl` first, the database has finished writing its logs to the disk. The `wsl --shutdown` command is essentially like pulling the power plug on a PC that is already turned off—it is perfectly safe for your data.

### SSH into container

```
podman machine ssh
```

### Get container info

```
cat /etc/os-release
```

```
[user@DESKTOP-FT1088C ~]$ cat /etc/os-release
NAME="Fedora Linux"
VERSION="41 (Container Image)"
RELEASE_TYPE=stable
ID=fedora
VERSION_ID=41
VERSION_CODENAME=""
PLATFORM_ID="platform:f41"
PRETTY_NAME="Fedora Linux 41 (Container Image)"
ANSI_COLOR="0;38;2;60;110;180"
LOGO=fedora-logo-icon
CPE_NAME="cpe:/o:fedoraproject:fedora:41"
DEFAULT_HOSTNAME="fedora"
HOME_URL="https://fedoraproject.org/"
DOCUMENTATION_URL="https://docs.fedoraproject.org/en-US/fedora/f41/"
SUPPORT_URL="https://ask.fedoraproject.org/"
BUG_REPORT_URL="https://bugzilla.redhat.com/"
REDHAT_BUGZILLA_PRODUCT="Fedora"
REDHAT_BUGZILLA_PRODUCT_VERSION=41
REDHAT_SUPPORT_PRODUCT="Fedora"
REDHAT_SUPPORT_PRODUCT_VERSION=41
SUPPORT_END=2025-12-15
VARIANT="Container Image"
VARIANT_ID=container
```


## Podman compose

Yes, a **Podman Compose** file would help significantly. While your current command works, it is "imperative"—meaning you have to remember and re-type (or copy-paste) that long string every time you want to recreate or update the container.

Using a `compose.yaml` file (the "declarative" way) offers several advantages for your specific setup:

### 1. Benefits for your specific setup
*   **Version Control:** You can save the file in your project folder. If you change a setting (like `shared_buffers`), you just edit the text file instead of trying to edit a massive terminal command.
*   **Automatic Restarts:** You can add `restart: always` so the DB starts automatically when your machine/WSL2 starts.
*   **Readability:** It’s much easier to see the relationship between your shared memory (`shm_size`), volumes, and Postgres flags.
*   **One-Command Management:** Instead of multiple steps (creating volume, then running), you just run `podman-compose up -d`.

### 2. Your command converted to `compose.yaml`
Create a file named `compose.yaml` in your project directory and paste this:

```yaml
services:
  postgres:
    image: postgres:latest
    container_name: postgres-wsl
    restart: always
    environment:
      - POSTGRES_PASSWORD=mysecretpassword
      - PGDATA=/var/lib/postgresql/data
    ports:
      - "5432:5432"
    volumes:
      # The :Z ensures correct SELinux labels (useful if using RHEL/Fedora in WSL)
      - pg_data_final:/var/lib/postgresql/data:Z
    shm_size: '1gb'
    # This translates your -c flags into the startup command
    command: 
      - postgres
      - -c
      - shared_buffers=512MB
      - -c
      - random_page_cost=1.1
      - -c 
      - effective_io_concurrency=200        

volumes:
  pg_data_final:
    external: true  # Tells Podman to use the volume you already created manually
```

### 3. How to use it
1.  **Install Podman Compose** (if you haven't yet):
    ```powershell
    pip install podman-compose
    ```
2.  **Start the container**:
    In the same folder as your file, run:
    ```powershell
    podman-compose up -d
    ```
3.  **Stop the container**:
    ```powershell
    podman-compose down
    ```

### Key differences to note:
*   **`shm_size`**: In your manual command, you used `--shm-size=1g`. In the Compose file, it’s a dedicated setting. This is critical for Postgres performance with large `shared_buffers`.
*   **`external: true`**: I set the volume as "external" because you already created `pg_data_final` manually. If you want Compose to manage the volume lifecycle entirely, you would remove `external: true`.
*   **Postgres Flags**: The `command` section cleanly breaks down your `-c` configurations, making them much easier to adjust later as your database grows.

## The VHDX 

`podman-machine-default` is the standard, automatically assigned name for the Linux virtual machine (VM) that Podman creates on macOS and Windows to run containers, acting as the default target for Podman commands like `podman machine init`. It provides a Linux environment (Fedora CoreOS) for container operations, allowing Podman to function on non-Linux systems, and you use commands like `podman machine start`, `stop`, `list`, and `init` to manage it.

### Using PowerShell to show  WSL distros

```powershell
(Get-ChildItem HKCU:\Software\Microsoft\Windows\CurrentVersion\Lxss | ForEach-Object {Get-ItemProperty $_.PSPath}) | Select-Object DistributionName, BasePath
```

```
DistributionName       BasePath
----------------       --------
Ubuntu                 C:\Users\thumb\AppData\Local\wsl\{73929071-0e78-42fe-a25d-96580d570fe0}
podman-machine-default \\?\C:\Users\thumb\.local\share\containers\podman\machine\wsl\wsldist\podman-machine-default
```

### Using the registry to see WSL distros

```
HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Lxss
```

```
C:\Users\\thumb\.local\share\containers\podman\machine\wsl\wsldist\podman-machine-default\ext4.vhdx
```

```
DistributionName       BasePath
----------------       --------
Ubuntu                 C:\Users\thumb\AppData\Local\wsl\{73929071-0e78-42fe-a25d-96580d570fe0}
podman-machine-default \\?\C:\Users\thumb\.local\share\containers\podman\machine\wsl\wsldist\podman-machine-default
```

### The Windows Extended Length Path Prefix

The path prefix for the `podman-machine-default` is a Windows "[Extended Length Path](https://learn.microsoft.com/en-us/windows/win32/fileio/maximum-file-path-limitation?tabs=registry)" prefix. 

```
\\?\
```

- This tells Windows to ignore the standard 260-character path limit.    
- It's necessary with WSL and Podman because they often use deeply nested folders. Without this prefix, some Windows applications would crash or fail to find the file because the folder path is too long.