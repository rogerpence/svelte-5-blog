---
title: VS Code Prettier/ESLint configuration
description: VS Code Prettier/ESLint configuration
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - vs-code
---
To configure Prettier to use 4 spaces instead of tabs, update your .prettierrc file:

.prettierrc

```json
{
    "useTabs": false,
    "tabWidth": 4,
    "singleQuote": true,
    "trailingComma": "none",
    "printWidth": 120,
    "plugins": ["prettier-plugin-svelte"],
    "overrides": [
        {
            "files": "*.svelte",
            "options": {
                "parser": "svelte"
            }
        }
    ]
}
```

eslint.config.js

```js
import prettier from "eslint-config-prettier";
import js from "@eslint/js";
import { includeIgnoreFile } from "@eslint/compat";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import { fileURLToPath } from "node:url";
import ts from "typescript-eslint";
import svelteConfig from "./svelte.config.js";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default ts.config(
    includeIgnoreFile(gitignorePath),
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs.recommended,
    prettier,
    ...svelte.configs.prettier,
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
        rules: {
            "no-undef": "off",
            indent: ["error", 4], // Add this line to enforce 4 spaces
        },
    },
    {
        files: [
            "**/*.svelte",
            "**/*.svelte.ts",
            "**/*.svelte.js",
            "**/*.js",
            "**/*.ts",
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
                extraFileExtensions: [".svelte"],
                parser: ts.parser,
                svelteConfig,
            },
        },
    }
);
```

Configure VS Code to automatically run Prettier on files when they're saved. Here's how to set it up:

## 1. Install the Prettier Extension

If you haven't already, install the official Prettier extension:

-   Open Extensions view (Ctrl+Shift+X)
-   Search for "Prettier - Code formatter"
-   Click Install

## 2. Configure VS Code Settings

Add these settings to your VS Code settings.json file:

```json
// For User Settings: File > Preferences > Settings > (click icon to edit in JSON)
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[svelte]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
}
```

## 3. Create a Workspace Settings File (Optional)

For project-specific settings, create or edit `.vscode/settings.json`:

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "prettier.requireConfig": true
}
```

This way, Prettier will automatically format your code according to your .prettierrc settings every time you save a file.