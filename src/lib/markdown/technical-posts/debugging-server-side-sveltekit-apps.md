---
title: Debugging Sveltekit apps
description: Debugging Sveltekit apps
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - svelte
  - debug
---

To debug server-side SvelteKit code, you can use Visual Studio Code by attaching the debugger to the running Node.js process. First, set breakpoints in your server-side code (e.g., in +server.js or +page.js files). Then, start the development server with npx vite dev. Next, in VS Code, choose "Debug: Attach to Node process" from the command palette. Finally, hit your HTTP endpoint to trigger the debugger and examine the code at the breakpoints.

**Detailed Steps:**

1. Set Breakpoints:
   Open your SvelteKit project in VS Code and place breakpoints in your server-side code, such as functions within +server.js or +page.js files.
2. Start the Development Server:
   Open a terminal and run npx vite dev to start the SvelteKit development server.
3. Attach to Node Process:
   In VS Code, press Ctrl+Shift+P (or Cmd+Shift+P on macOS) to open the command palette. Type "Debug: Attach to Node process" and select the option.
4. Hit the Endpoint:
   Navigate to the URL of your SvelteKit application in your browser. This will trigger the server-side code and stop the execution at the breakpoints you've set.
5. Debug and Inspect:
   VS Code will now open the debugger, allowing you to step through the code, inspect variables, and examine the execution flow at each breakpoint.

**Important Notes:**

Make sure your VS Code is configured with the Node.js Debugger extension, according to Svelte's documentation.
You might need to add the node-loader plugin to your vite.config.js file before the SvelteKit plugin for debugging to work correctly, as suggested by Codelantis.

Breakpoints in uncompiled Svelte/TS source files might not work due to a Vite issue with sourcemaps.
For more detailed information and alternative debugging approaches, you can refer to the Svelte documentation on debugging and the VS Code documentation on debugging.

For more detailed information and alternative debugging approaches, you can refer to the [Svelte documentation on debugging](https://svelte.dev/docs/kit/debugging) and the VS Code documentation on debugging.

## Debugging Sveltekit client side with @debug

[This info is from this page](https://svelte.dev/docs/svelte/@debug)

The `{@debug ...}` tag offers an alternative to `console.log(...)`. It logs the values of specific variables whenever they change, and pauses code execution if you have devtools open.

```
<script>
	let user = {
		firstname: 'Ada',
		lastname: 'Lovelace'
	};
</script>

{@debug user}

<h1>Hello {user.firstname}!</h1>
```

`{@debug ...}` accepts a comma-separated list of variable names (not arbitrary expressions).

```
<!-- Compiles -->
{@debug user}
{@debug user1, user2, user3}

<!-- WON'T compile -->
{@debug user.firstname}
{@debug myArray[0]}
{@debug !isReady}
{@debug typeof user === 'object'}
```

The `{@debug}` tag without any arguments will insert a `debugger` statement that gets triggered when *any* state changes, as opposed to the specified variables.

`.vscode\launch.json`

```js
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "attach",
            "name": "Attach to SvelteKit (Node)",
            "port": 9229, // Default inspect port. Change if your server uses a different one.
            "restart": true, // Automatically try to re-attach if the process restarts
            "protocol": "inspector", // Modern protocol
            "skipFiles": [
                "<node_internals>/**", // Skip Node.js internal files
                "${workspaceFolder}/node_modules/**" // Skip node_modules
            ]
        }
    ]
}
```