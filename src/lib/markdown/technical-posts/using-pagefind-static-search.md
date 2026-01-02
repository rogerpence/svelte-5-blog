---
title: Using PageFind static search
description: Using PageFind static search
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - search
---
PageFind creates an static index at build time. I had it working at this project: `C:\Users\thumb\Documents\projects\astro\astro-blog-archive`. The files below are in that project.

Create the PageFind index from an array of Json objects.

`create-index.js`

```
import * as pagefind from "pagefind";

import { docmap } from "./data/index-objects.js";

// Create a Pagefind search index to work with
const { index } = await pagefind.createIndex();

import * as env from "./env.js";

import path from "path";

const folder = docmap[0];

async function main() {
    docmap[0].docs.map(async (doc) => {
        await index.addCustomRecord(doc);
    });

    await index.writeFiles({
        outputPath: "../public/pagefind",
    });
}

await main();
```

One of its gotchas is that the static index must be located where Vercel can find it--which I think is at `.vercel/output/static/pagefind`.

The PowerShell file below is the post-build script that copies the dev static index info to prod.

```
if (test-path .\public\pagefind) {
    remove-item .\public\pagefind -force -recurse
}

if (test-path .vercel\output\static\pagefind) {
    remove-item .vercel\output\static\pagefind -force -recurse
}

node .\cmd-line\create-index-objects.js
node .\cmd-line\create-index.js

copy-item .\public\pagefind -destination .\.vercel\output\static\pagefind -recurse -force

node .\cmd-line\create-tagmap-objects.js
```

See the Astro project's `PageFindLogic.astro` component for a way to build the PageFind UI.