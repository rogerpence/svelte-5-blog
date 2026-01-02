---
title: Run SvelteKit app locally
description: Run SvelteKit app locally
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
Okay, if you don't need PM2 for persistence and are happy to manually start the server when you want to use your SvelteKit app locally, it's much simpler!

You'll still need to decide if your app requires a Node.js server (for SSR, API routes, etc.) or if it can be served as static files.

**Method 1: For SvelteKit apps using `adapter-node` (needs a Node.js server)**

1.  **Ensure `adapter-node` is configured:**
    Make sure your `svelte.config.js` uses `@sveltejs/adapter-node`:

    ```javascript
    // svelte.config.js
    import adapter from "@sveltejs/adapter-node";
    import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

    /** @type {import('@sveltejs/kit').Config} */
    const config = {
        preprocess: vitePreprocess(),
        kit: {
            adapter: adapter(), // Default output is 'build'
        },
    };
    export default config;
    ```

2.  **Build your SvelteKit App:**
    Open your terminal in the project root and run:

    ```bash
    npm run build
    ```

    This creates a `build` directory (or your configured output directory) containing the server and assets.

3.  **Manually Start the Node.js Server:**
    Navigate to your project's root directory in the terminal (if you aren't already there). The entry point for the server is typically `build/index.js`.
    You can run it directly with Node:

    ```bash
    node build/index.js
    ```

    -   **Port:** By default, it might run on port 3000. If you need to change the port, the SvelteKit Node adapter typically respects the `PORT` environment variable:
        ```bash
        PORT=4000 node build/index.js
        ```
    -   **Host:** To make it accessible on your local network (not just `localhost`), you might also set the `HOST` environment variable:
        ```bash
        HOST=0.0.0.0 PORT=3000 node build/index.js
        ```
        (Using `0.0.0.0` makes it listen on all available network interfaces).

4.  **Access your app:**
    Open your browser and go to `http://localhost:3000` (or the port you specified). If you used `HOST=0.0.0.0`, you can also access it from other devices on your local network using your desktop's IP address (e.g., `http://192.168.1.100:3000`).

5.  **To Stop the Server:**
    Go back to the terminal where the server is running and press `Ctrl+C`.

**Method 2: For SvelteKit apps using `adapter-static` (can be served as static files)**

1.  **Ensure `adapter-static` is configured:**
    Make sure your `svelte.config.js` uses `@sveltejs/adapter-static`:

    ```javascript
    // svelte.config.js
    import adapter from "@sveltejs/adapter-static";
    import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

    /** @type {import('@sveltejs/kit').Config} */
    const config = {
        preprocess: vitePreprocess(),
        kit: {
            adapter: adapter({
                pages: "build",
                assets: "build",
                fallback: "index.html", // or 200.html - important for SPAs
                precompress: false,
            }),
        },
    };
    export default config;
    ```

2.  **Build your SvelteKit App:**

    ```bash
    npm run build
    ```

    This creates a `build` directory (or your configured output directory) with static HTML, CSS, and JS files.

3.  **Manually Serve the Static Files:**
    You need a simple HTTP server. Here are a couple of easy options:

    -   **Using `serve` (npm package):**
        If you have Node.js, you can use `npx` to run `serve` without installing it globally:

        ```bash
        cd build  # Navigate into your build output directory
        npx serve -s . -p 3000
        ```

        (The `-s` flag tells `serve` to handle single-page app routing by serving `index.html` for any path not found, which is useful if you used a `fallback` in your adapter settings).
        If you prefer to install it globally once: `npm install -g serve`, then you can just run `serve -s . -p 3000` from within the `build` directory.

    -   **Using Python's built-in HTTP server:**
        If you have Python installed:
        ```bash
        cd build  # Navigate into your build output directory
        # For Python 3:
        python -m http.server 3000
        # For Python 2:
        # python -m SimpleHTTPServer 3000
        ```
        Note: Python's built-in server is very basic and might not correctly serve `index.html` for sub-paths in an SPA setup without extra configuration or a more advanced server. `serve` with the `-s` flag is generally better for SPAs.

4.  **Access your app:**
    Open your browser and go to `http://localhost:3000` (or the port you specified).

5.  **To Stop the Server:**
    Go back to the terminal where the server is running and press `Ctrl+C`.

**Summary for Manual Start:**

1.  **Choose your adapter** (`adapter-node` or `adapter-static`) in `svelte.config.js`.
2.  **Build:** `npm run build`.
3.  **Run:**
    -   For `adapter-node`: `node build/index.js` (optionally with `PORT=` and `HOST=`).
    -   For `adapter-static`: `cd build` then `npx serve -s . -p <port>` (or use Python's server).
4.  **Stop:** `Ctrl+C` in the terminal.

Whenever you make changes to your SvelteKit code, you'll need to **re-run `npm run build`** and then restart your server manually using the chosen command.

This approach avoids the overhead of PM2 if you only need the app running while you're actively working with it or showing it locally.