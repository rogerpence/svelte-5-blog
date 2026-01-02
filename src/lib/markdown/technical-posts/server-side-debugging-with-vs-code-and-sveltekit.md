---
title: Server side debugging with VS Code and Sveltekit
description: Server side debugging with VS Code and Sveltekit
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - svelte
  - debug
---
For a while, using VS Codes `Debug: Attach to Node process` and worked without the steps below. However, and I think it was after a VS Code update, that just flat quit working. This technique is probably easier.

## Step 1. Put Node into debug mode

Node has a command line argument to put it into debug mode. However, Sveltekit uses Vite, so you can't add Node arguments directly. This environment setting is a work-around for that.

```powershell
$env:NODE_OPTIONS="--inspect"
```

Add this function to your PowerShell profile (notepad $profile) to easily set the NODE_OPTIONS value when you need it. This debug mode only kicks in when you launch the debugger from VS Code.

```powershell
function nodedebug {
	$env:NODE_OPTIONS="--inspect"
	Write-Host Node server-side debugging enabled -foregroundcolor green
}
```

## Step 2. Add a VS Code `launch.json` file

Add this file to `.\.vscode\launch.json`

```json
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
        // You might also have a configuration for launching the dev server directly
        // (though attaching is often preferred for SvelteKit/Vite)
        // {
        //   "type": "node",
        //   "request": "launch",
        //   "name": "Launch SvelteKit Dev (Debug)",
        //   "runtimeExecutable": "npm",
        //   "runtimeArgs": [
        //     "run",
        //     "dev"
        //   ],
        //   "env": {
        //     "NODE_OPTIONS": "--inspect"
        //   },
        //   "console": "integratedTerminal",
        //   "port": 9229, // Ensure this matches the inspect port
        //   "serverReadyAction": {
        //     "pattern": "Local:.+ (http://localhost:5173/)", // Adjust port if needed
        //     "uriFormat": "%s",
        //     "action": "openExternally"
        //   }
        // }
    ]
}
```