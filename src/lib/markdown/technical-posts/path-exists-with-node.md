---
title: Check that a file, directory, or path exists with Node
description: Check that a file, directory, or path exists with Node
date_updated: '2025-12-04T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - typescript
  - node
---
```ts
import {
    truncatePathAfterDirectory,
    getPathForCli,
} from "../../src/filesystem";
import path from "path";
import { fileURLToPath } from "url";
import fs, { promises as fsa } from "fs";

export function getFileCurrentDirectory() {
    //const __filename = fileURLToPath(import.meta.url);
    //const __dirname = path.dirname(__filename);
    const currentFileDir = path.resolve(".");
    return currentFileDir;
}

export function getTestDataPath(...segments: string[]) {
    const currentFileDir = truncatePathAfterDirectory(
        getFileCurrentDirectory(),
        "utils"
    );
    const resultPath = path.join(currentFileDir, "test-data", ...segments);

    return resultPath 
}

// 1. Synchronous - Check if path exists
function pathExists(pathToCheck: string): boolean {
    return fs.existsSync(pathToCheck);
}

// 2. Async - Check if path exists (recommended)
async function pathExistsAsync(pathToCheck: string): Promise<boolean> {
    try {
        await fsa.access(pathToCheck);
        return true;
    } catch {
        return false;
    }
}

// 3. Get detailed information about the path
async function getPathInfo(pathToCheck: string) {
    try {
        const stats = await fsa.stat(pathToCheck);
        return {
            exists: true,
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory(),
            size: stats.size,
        };
    } catch {
        return { exists: false };
    }
}

// Usage examples:
const testPath = getTestDataPath();
console.log('Path:', testPath);
console.log('Exists (sync):', pathExists(testPath));

// Async usage:
(async () => {
    console.log('Exists (async):', await pathExistsAsync(testPath));
    console.log('Info:', await getPathInfo(testPath));
})();
  
```