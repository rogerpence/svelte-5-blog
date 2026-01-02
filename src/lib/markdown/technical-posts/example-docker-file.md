---
title: An example docker file
description: An example docker file
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - docker
  - containers
  - podman
---
An example `Dockerfile` for setting up a PostgreSQL container.

**Important Consideration:**

-   **Using Official Images:** For standard services like databases (PostgreSQL, MySQL, Redis, etc.), it's almost always better to use the official image directly rather than building your own `Dockerfile` from scratch _unless_ you need very specific customizations _during the build process_ (like installing custom extensions requiring compilation). The official images are well-maintained, secure, and handle initialization correctly.
-   **Named Volumes are Runtime:** You _declare_ a volume mount point within the `Dockerfile` using the `VOLUME` instruction. However, you _create and attach_ the **named** volume when you _run_ the container (`docker run ... -v your-volume-name:/path/in/container ...`) or define it in a `docker-compose.yml` file. The `Dockerfile` itself doesn't create the _named_ volume.

Therefore, the simplest `Dockerfile` for PostgreSQL often just leverages the official image and its built-in mechanisms. You'd typically use a `docker-compose.yml` file or a `docker run` command to manage the named volume and environment variables.

However, if you wanted a `Dockerfile` that _could_ be used as a base, perhaps adding custom initialization scripts, it might look something like this:

**Example `Dockerfile` (Illustrative - Often not needed for basic setup)**

```dockerfile
# Using a specific version is recommended over 'latest' for stability
FROM postgres:15

# --- Environment Variables (Can also be set at runtime) ---
# Set the password for the default 'postgres' superuser
# !! IMPORTANT: Do NOT hardcode sensitive passwords here in production.
# !! Use environment variables passed during 'docker run' or secrets management.
ENV POSTGRES_PASSWORD=mysecretpassword

# Optional: Create a default database for your application
ENV POSTGRES_DB=app_db

# Optional: Create a default user for your application
ENV POSTGRES_USER=app_user
# If POSTGRES_USER is set, POSTGRES_PASSWORD applies to this user too

# --- Custom Initialization (Optional) ---
# Copy custom SQL or shell scripts to be run on first initialization
# These scripts run only when the database cluster is initialized (i.e., the volume is empty)
# COPY ./my_init_scripts/ /docker-entrypoint-initdb.d/

# --- Data Volume ---
# Declare the standard PostgreSQL data directory as a volume mount point.
# This tells Docker that data in this directory should be persisted.
# When you run the container, you'll map a named volume to this path.
VOLUME /var/lib/postgresql/data

# --- Port Exposure ---
# Document that the container exposes the default PostgreSQL port
# This doesn't publish the port; publishing happens during 'docker run -p ...'
EXPOSE 5432

# The CMD is inherited from the base postgres image, which starts the server.
# You typically don't need to override CMD or ENTRYPOINT unless doing something advanced.
```

**How to Build and Run (The important part for named volumes):**

1.  **Save:** Save the content above into a file named `Dockerfile` in an empty directory (or a directory containing only your optional `my_init_scripts` folder if you uncommented that section).

2.  **Build (Optional, as you often just use the official image):**

    ```bash
    docker build -t my-custom-postgres .
    ```

    _(Note: If you didn't add any custom files or steps beyond ENV/VOLUME/EXPOSE, this custom image is functionally identical to the base `postgres:15` image)._

3.  **Create a Named Volume (If it doesn't exist):**

    ```bash
    docker volume create postgres_data
    ```

4.  **Run the Container using the Named Volume:**

    -   **Using the official image directly (Recommended):**

        ```bash
        docker run --name my-postgres-container -d \
          -e POSTGRES_PASSWORD=mysecretpassword \
          -e POSTGRES_DB=app_db \
          -e POSTGRES_USER=app_user \
          -p 5432:5432 \
          -v postgres_data:/var/lib/postgresql/data \
          postgres:15
        ```

    -   **Using your custom-built image (if you built one):**
        ```bash
        docker run --name my-postgres-container -d \
          -p 5432:5432 \
          -v postgres_data:/var/lib/postgresql/data \
          my-custom-postgres
        ```
        _(Note: The ENV variables set in the Dockerfile will be used unless overridden with `-e` here)_

**Explanation of the `docker run` command:**

-   `docker run`: The command to create and start a container.
-   `--name my-postgres-container`: Assigns a name to the container for easy reference.
-   `-d`: Runs the container in detached mode (in the background).
-   `-e POSTGRES_PASSWORD=...`: Sets environment variables (overriding any in the image if needed). **This is the secure way to pass passwords.**
-   `-p 5432:5432`: Publishes the container's port 5432 to the host machine's port 5432.
-   `-v postgres_data:/var/lib/postgresql/data`: **This is the key part.** It maps the **named volume** `postgres_data` (which you created or Docker creates automatically if it doesn't exist) to the `/var/lib/postgresql/data` directory _inside_ the container (the one declared with `VOLUME` in the Dockerfile). This ensures data persistence.
-   `postgres:15` or `my-custom-postgres`: The image to use.

In summary, while the `Dockerfile` _declares_ the volume mount point (`/var/lib/postgresql/data`), the actual creation and attachment of the **named volume** (`postgres_data`) happens at **runtime** via the `docker run -v` command or a `docker-compose.yml` file. For standard PostgreSQL, using the official image directly with `docker run` or `docker-compose` is usually the best approach.