---
title: example docker compose file for a sveltekit app
description: example docker compose file for a sveltekit app
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - docker
  - containers
---
I need to build a new web app using sveltekit 2.0. I want to build this app with docker containers; probably one for node js and one for postgres (using official images). the postgres container is for local development--at runtime the app will connect to supabase. I'll deploy this app to vercel. Show me an example docker compose file for this project.

Okay, let's create a `docker-compose.yml` file for your SvelteKit 2.0 project, designed for local development with a Node.js service for the app and a separate PostgreSQL service mimicking Supabase.

This setup assumes:

1.  You have Docker and Docker Compose installed.
2.  You have already initialized your SvelteKit project (e.g., using `npm create svelte@latest my-app`).
3.  Your SvelteKit app will read database connection details from environment variables (a common practice).

Here's the example `docker-compose.yml` file. Place this file in the root directory of your SvelteKit project.

```yaml
version: "3.8" # Use a recent version of the Compose file format

services:
    # SvelteKit Application Service (Node.js)
    app:
        container_name: sveltekit_app_dev
        # Use an official Node.js image. Choose a version compatible with SvelteKit 2.0 (LTS recommended)
        # Alpine versions are smaller.
        image: node:20-alpine
        # Set the working directory inside the container
        working_dir: /app
        # Mount the current directory (.) on the host to /app in the container
        # This allows live code changes during development.
        # ':cached' can improve performance on macOS/Windows.
        volumes:
            - .:/app:cached
            # Optional: Use a named volume for node_modules to potentially speed up installs
            # and avoid issues with host OS differences. Uncomment if needed.
            # - node_modules:/app/node_modules
        # Expose the SvelteKit/Vite development server port
        ports:
            - "5173:5173" # Map host port 5173 to container port 5173 (Vite default)
        # Command to run inside the container:
        # 1. Install dependencies if node_modules doesn't exist (or is empty)
        # 2. Run the development server, making it accessible outside the container (--host)
        command: sh -c "npm install && npm run dev -- --host"
        # Environment variables needed by the SvelteKit app
        environment:
            # --- IMPORTANT ---
            # These variables should match the ones used in the 'db' service below
            # Your SvelteKit app needs to be configured to use these for the DB connection
            # Example using a standard PostgreSQL connection string:
            DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
            # Add any other environment variables your app needs for development
            # VITE_SOME_API_KEY: your_dev_key
            # Ensure Vite picks up env vars by prefixing with VITE_ if needed on the client-side
        depends_on:
            db:
                # Wait for the database service to be healthy before starting the app
                condition: service_healthy
        networks:
            - sveltekit_network

    # PostgreSQL Database Service (for local development)
    db:
        container_name: postgres_dev
        # Use an official PostgreSQL image
        image: postgres:16-alpine # Use a specific version, Alpine is smaller
        ports:
            # Map a host port (e.g., 5433) to the default PostgreSQL port (5432) in the container
            # Use 5433 to avoid conflicts if you have Postgres installed locally on 5432.
            - "5433:5432"
        environment:
            # --- IMPORTANT ---
            # Define the credentials for the local development database.
            # These MUST match the variables used in the DATABASE_URL for the 'app' service.
            # Use strong passwords even for local dev, or manage them via .env file (see below)
            POSTGRES_USER: ${POSTGRES_USER:-devuser} # Default to 'devuser' if not set in .env
            POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-devpassword} # Default to 'devpassword' if not set in .env
            POSTGRES_DB: ${POSTGRES_DB:-devdb} # Default to 'devdb' if not set in .env
        volumes:
            # Mount a named volume to persist database data across container restarts
            - postgres_data:/var/lib/postgresql/data
        healthcheck:
            # Checks if the PostgreSQL server is ready to accept connections
            test:
                ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
            interval: 10s
            timeout: 5s
            retries: 5
            start_period: 10s # Give Postgres some time to start up initially
        restart: unless-stopped # Restart the DB container unless manually stopped
        networks:
            - sveltekit_network

# Define named volumes
volumes:
    postgres_data: # Volume for persisting PostgreSQL data
    # node_modules: # Uncomment if using the named volume for node_modules in the 'app' service

# Define networks
networks:
    sveltekit_network:
        driver: bridge
```

**Explanation:**

1.  **`version: '3.8'`**: Specifies the Docker Compose file format version.
2.  **`services:`**: Defines the different containers that make up your application stack.
    -   **`app` service (SvelteKit):**
        -   `image: node:20-alpine`: Uses the official Node.js 20 image (Alpine variant for smaller size).
        -   `working_dir: /app`: Sets the default directory inside the container.
        -   `volumes: .:/app:cached`: Mounts your project code into the container. Changes you make locally are reflected inside the container instantly (thanks to Vite's HMR). `:cached` can improve performance.
        -   `ports: - "5173:5173"`: Maps port 5173 on your host machine to port 5173 in the container, where the Vite dev server runs.
        -   `command: sh -c "npm install && npm run dev -- --host"`: First runs `npm install` (or `yarn install` if you use Yarn) to get dependencies, then starts the dev server using `npm run dev`. The `-- --host` part is crucial – it tells Vite to listen on `0.0.0.0` inside the container, making it accessible from your host machine via the mapped port.
        -   `environment: DATABASE_URL: ...`: **Crucially**, this sets the database connection string your SvelteKit app will use. Notice it uses the _service name_ `db` as the hostname. Docker Compose's internal networking handles resolving `db` to the correct container's IP address. It also references environment variables (`${POSTGRES_USER}`, etc.) which we'll define shortly.
        -   `depends_on: db: condition: service_healthy`: Tells Docker Compose to start the `app` service only _after_ the `db` service reports itself as healthy (passes its healthcheck).
        -   `networks: - sveltekit_network`: Connects this service to a custom bridge network.
    -   **`db` service (PostgreSQL):**
        -   `image: postgres:16-alpine`: Uses the official PostgreSQL 16 image.
        -   `ports: - "5433:5432"`: Maps port 5433 on your host to the standard Postgres port 5432 inside the container. You'll connect to `localhost:5433` from your local machine using a tool like DBeaver, pgAdmin, or `psql`.
        -   `environment:`: Sets required environment variables for the Postgres container to initialize itself.
            -   `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`: Define the user, password, and database name. The syntax `${VAR:-default}` allows you to override these using a `.env` file (recommended) or uses the defaults provided.
        -   `volumes: - postgres_data:/var/lib/postgresql/data`: Mounts a _named volume_ called `postgres_data` to the location where Postgres stores its data files. This ensures your database data persists even if you stop and remove the container (`docker compose down`).
        -   `healthcheck:`: Defines a command (`pg_isready`) Docker runs periodically to check if the database is responsive. This is used by the `app` service's `depends_on` condition.
        -   `restart: unless-stopped`: Ensures the database container restarts automatically if it crashes, unless you explicitly stop it.
        -   `networks: - sveltekit_network`: Connects this service to the same network as the app.
3.  **`volumes:`**: Defines the named volumes used by the services (in this case, `postgres_data`).
4.  **`networks:`**: Defines the custom network. Using a custom network is generally good practice for isolating container communication.

**How to Use:**

1.  **Create a `.env` file:** In the same directory as your `docker-compose.yml`, create a file named `.env` (make sure to add `.env` to your `.gitignore` file!). This file will securely store your environment variables. Docker Compose automatically loads variables from this file.

    ```dotenv
    # .env file

    # PostgreSQL Credentials for Local Development
    POSTGRES_USER=myuser
    POSTGRES_PASSWORD=mypassword123
    POSTGRES_DB=mykitapp_dev

    # Add any other secrets or dev-specific variables here
    # VITE_SOME_API_KEY=your_dev_key_here
    ```

    _Replace `myuser`, `mypassword123`, and `mykitapp_dev` with your desired local credentials._

2.  **Configure SvelteKit:** Ensure your SvelteKit application (e.g., in `src/hooks.server.js`, `src/lib/server/db.js`, or wherever you initialize your database connection) reads the `DATABASE_URL` environment variable. You might use libraries like `dotenv` (though Docker Compose handles loading `.env` for the container) or rely on SvelteKit's built-in environment variable handling (e.g., using `$env/static/private` for server-side variables).

3.  **Run Docker Compose:** Open your terminal in the project root directory and run:

    ```bash
    docker compose up -d
    ```

    -   `up`: Creates and starts the containers.
    -   `-d`: Runs the containers in detached mode (in the background).
    -   The first time you run this, Docker will download the `node` and `postgres` images, which might take a few minutes. Subsequent runs will be much faster. It will also run `npm install` inside the `app` container.

4.  **Access Your App:** Open your web browser and navigate to `http://localhost:5173`. You should see your SvelteKit development server running.

5.  **Access Your Database (Optional):** You can connect to your local development PostgreSQL database using a database client tool:

    -   Host: `localhost`
    -   Port: `5433` (the host port you mapped)
    -   Database: `mykitapp_dev` (or whatever you set in `.env`)
    -   User: `myuser` (or whatever you set in `.env`)
    -   Password: `mypassword123` (or whatever you set in `.env`)

6.  **View Logs:** To see the logs from your containers:

    ```bash
    docker compose logs -f # Follow logs for all services
    docker compose logs -f app # Follow logs for the app service only
    docker compose logs -f db  # Follow logs for the db service only
    ```

7.  **Stop Containers:** When you're done:
    ```bash
    docker compose down
    ```
    -   This stops and removes the containers.
    -   The `postgres_data` volume persists, so your database data will be there the next time you run `docker compose up -d`. If you want to remove the volume too (delete all DB data), use `docker compose down -v`.

**Vercel Deployment Note:**

This `docker-compose.yml` is specifically for **local development**. When you deploy to Vercel:

-   Vercel will build your SvelteKit app using its own build infrastructure (likely based on your `package.json` and potentially a `vercel.json` config). It doesn't use this Dockerfile or docker-compose setup directly for deployment builds.
-   You will configure Vercel's **Environment Variables** section in your project settings to point to your **actual Supabase** database URL and any other production secrets. The `DATABASE_URL` environment variable name should ideally be consistent between your local `.env` setup and your Vercel settings.
-   Your SvelteKit code should fetch the `DATABASE_URL` from the environment, automatically using the local Postgres URL during `docker compose up` development and the Supabase URL when deployed on Vercel.

```
podman run -it -v .:/var/roger alpine
```