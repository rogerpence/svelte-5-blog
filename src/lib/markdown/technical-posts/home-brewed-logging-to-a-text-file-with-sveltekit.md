---
title: Home-brewed logging to a text file with Sveltekit
description: Home-brewed logging to a text file with Sveltekit
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
Okay, logging to a text file in SvelteKit requires understanding _where_ your code is running:

1.  **Server-Side:** Code in `+page.server.js`, `+layout.server.js`, API routes (`+server.js`), and `hooks.server.js` runs on the server (Node.js environment by default). This code **can** directly write to the filesystem.
2.  **Client-Side (Browser):** Code in `+page.svelte`, `+layout.svelte`, client-side hooks (`hooks.client.js`), and regular `.js`/`.ts` files imported by Svelte components runs in the user's browser. This code **cannot** directly write to the server's filesystem due to security restrictions.

Therefore, the strategy depends on where you need to log from.

**Method 1: Logging from Server-Side Code (Recommended for most backend logic)**

This is the most straightforward approach for logging events happening on the server.

1.  **Create a Logging Utility (Optional but Recommended):**
    Create a helper file, for example, `src/lib/server/log.js`. The `server` directory ensures this module is only bundled for the server.

    ```javascript
    // src/lib/server/log.js
    import fs from "fs/promises"; // Use promises for async operations
    import path from "path";

    // Determine log file path (adjust as needed)
    // process.cwd() gives the root of your project when running `npm run dev` or `node build`
    const logFilePath = path.join(process.cwd(), "app.log");

    // Ensure the log directory exists (optional, but good practice)
    // You might want to run this once at startup if possible, e.g., in hooks.server.js
    async function ensureLogFileExists() {
        try {
            await fs.access(path.dirname(logFilePath));
        } catch (error) {
            if (error.code === "ENOENT") {
                // Directory doesn't exist, create it
                await fs.mkdir(path.dirname(logFilePath), { recursive: true });
            } else {
                // Other error accessing directory
                console.error("Error ensuring log directory exists:", error);
                throw error; // Re-throw if critical
            }
        }
        // Optionally touch the file to ensure it exists
        try {
            await fs.appendFile(logFilePath, ""); // Append empty string to create if not exists
        } catch (error) {
            console.error("Error ensuring log file exists:", error);
            throw error;
        }
    }
    // Consider calling ensureLogFileExists() appropriately

    /**
     * Appends a log message to the application's log file.
     * @param {string} level - Log level (e.g., 'INFO', 'WARN', 'ERROR').
     * @param {string} message - The main log message.
     * @param {any} [data] - Optional additional data (will be JSON.stringified).
     */
    export async function logToFile(level, message, data) {
        // Await ensureLogFileExists(); // Call here if ensuring on every log is acceptable

        const timestamp = new Date().toISOString();
        let logEntry = `${timestamp} [${level.toUpperCase()}] ${message}`;

        if (data) {
            try {
                // Handle potential circular references or errors during stringification
                const dataString = JSON.stringify(data, null, 2); // Pretty print JSON
                logEntry += `\nData: ${dataString}`;
            } catch (error) {
                logEntry += `\nData: [Error serializing data: ${error.message}]`;
            }
        }

        logEntry += "\n"; // Add a newline for separation

        try {
            // Use appendFile to add to the end of the file
            await fs.appendFile(logFilePath, logEntry, "utf8");
        } catch (err) {
            // Fallback to console if file logging fails
            console.error(`Failed to write to log file (${logFilePath}):`, err);
            console.error("Original Log Message:", logEntry.trim());
        }
    }

    // Convenience functions
    export const logInfo = (message, data) => logToFile("info", message, data);
    export const logWarn = (message, data) => logToFile("warn", message, data);
    export const logError = (message, error) => {
        // Special handling for Error objects to include stack trace
        if (error instanceof Error) {
            logToFile("error", message, {
                errorMessage: error.message,
                stack: error.stack,
            });
        } else {
            logToFile("error", message, error);
        }
    };
    export const logDebug = (message, data) =>
        logToFile("debug", message, data);

    // Call ensureLogFileExists once when the module loads (or handle startup logic elsewhere)
    ensureLogFileExists().catch((err) => {
        console.error("Initial log file setup failed:", err);
    });
    ```

2.  **Use the Logger in Server Modules:**
    Import and use the functions in your server-side files.

    ```javascript
    // src/routes/some-route/+page.server.js
    import { logInfo, logError } from "$lib/server/log";

    export async function load({ params }) {
        logInfo("Loading data for route", { routeId: params.slug });
        try {
            // ... fetch data or perform actions ...
            const data = { success: true, message: `Data for ${params.slug}` };
            logInfo("Data loaded successfully"); // Log success
            return data;
        } catch (error) {
            logError("Failed to load data for route", error); // Log the actual error object
            // Handle the error appropriately for the user
            // throw error(...) or return an error state
            return { success: false, error: "Failed to load data" };
        }
    }

    // --- OR ---

    // src/routes/api/users/+server.js
    import { json } from "@sveltejs/kit";
    import { logWarn } from "$lib/server/log";

    export async function POST({ request }) {
        const userData = await request.json();
        logWarn("Received POST request for user creation", userData);
        // ... process user creation ...
        return json({ userId: "123" }, { status: 201 });
    }
    ```

3.  **Add Log File to `.gitignore`:**
    Make sure your log file isn't committed to version control. Add this line to your `.gitignore` file:

    ```
    app.log
    # Or if you create a logs directory:
    /logs/
    ```

**Method 2: Logging from Client-Side Code (Requires an API Endpoint)**

Since the browser cannot write directly to the server's file system, you need to send the log message from the client to a server endpoint, which then uses the server-side logging utility (from Method 1).

1.  **Ensure you have the Server-Side Logger (Method 1) set up.**

2.  **Create an API Endpoint for Logging:**
    Create a file like `src/routes/api/log/+server.js`.

    ```javascript
    // src/routes/api/log/+server.js
    import { json } from "@sveltejs/kit";
    import { logToFile } from "$lib/server/log"; // Import your server-side logger

    /** @type {import('./$types').RequestHandler} */
    export async function POST({ request }) {
        try {
            const { level = "info", message, data } = await request.json();

            if (!message) {
                return json(
                    { error: "Log message is required" },
                    { status: 400 }
                );
            }

            // Use the server-side logger to write the file
            // Prefix client-side logs for clarity
            await logToFile(level, `[CLIENT] ${message}`, data);

            return json({ success: true }, { status: 200 });
        } catch (error) {
            // Log the error that occurred *within the logging endpoint itself* to the console
            console.error("Error processing client log request:", error);

            // Don't try to log this error using logToFile, as it might cause an infinite loop if file writing is the problem
            return json(
                { error: "Internal Server Error while logging" },
                { status: 500 }
            );
        }
    }
    ```

3.  **Create a Client-Side Logging Utility:**
    Create a helper, e.g., `src/lib/clientLog.js` (or place it in `src/lib/log.js` and use environment checks if you want a unified logger).

    ```javascript
    // src/lib/clientLog.js

    /**
     * Sends a log message to the server's logging endpoint.
     * @param {string} level
     * @param {string} message
     * @param {any} [data]
     */
    export async function logToServer(level, message, data) {
        try {
            const response = await fetch("/api/log", {
                // The path to your API endpoint
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ level, message, data }),
            });

            if (!response.ok) {
                // Log failure to console if sending fails
                console.error(
                    `Failed to send log to server (${response.status}): ${message}`,
                    data
                );
            }
        } catch (error) {
            // Log network or other errors to console
            console.error("Error sending log to server:", error);
            console.error("Original Log Message:", { level, message, data });
        }
    }

    // Convenience functions
    export const logClientInfo = (message, data) =>
        logToServer("info", message, data);
    export const logClientWarn = (message, data) =>
        logToServer("warn", message, data);
    export const logClientError = (message, data) =>
        logToServer("error", message, data);
    export const logClientDebug = (message, data) =>
        logToServer("debug", message, data);
    ```

4.  **Use the Client Logger in Components/Client Modules:**

    ```svelte
    <!-- src/routes/some-interactive-page/+page.svelte -->
    <script>
        import { onMount } from 'svelte';
        import { logClientInfo, logClientError } from '$lib/clientLog';

        onMount(() => {
            logClientInfo('Interactive page mounted');
        });

        function handleClick() {
            try {
                logClientInfo('Button clicked!');
                // ... some operation that might fail ...
                if (Math.random() < 0.5) {
                    throw new Error("Something went wrong on the client!");
                }
            } catch (error) {
                logClientError('Error during button click handler', { errorMessage: error.message });
                // Show user feedback, etc.
            }
        }
    </script>

    <button on:click={handleClick}>Click Me</button>
    ```

**Important Considerations:**

-   **Log Rotation:** For production applications, log files can grow very large. Implement log rotation (automatically archiving or deleting old logs). Libraries like `rotating-file-stream` can help, or use system tools like `logrotate`.
-   **Performance:** Excessive logging, especially synchronous file writing (`fs.appendFileSync`), can impact server performance. Use asynchronous methods (`fs.promises.appendFile`) where possible. For high-volume logging, consider more robust logging libraries.
-   **Structured Logging:** Using JSON or another structured format for logs makes them easier to parse and analyze with log management tools.
-   **Error Handling:** Make your logging robust. What happens if the log file cannot be written to (permissions, disk full)? Have fallbacks (like logging to `console.error`).
-   **Configuration:** Make the log file path and log level configurable (e.g., via environment variables).
-   **Libraries:** For more advanced features (multiple transports like console + file, different formats, levels, etc.), consider using dedicated logging libraries like `winston` or `pino`. You would integrate them similarly within the server-side utility.
-   **Deployment:** Ensure the directory where you intend to write logs exists and has the correct write permissions in your deployment environment. This location might differ from your local development setup. Persistent storage might be needed if deploying to ephemeral containers.