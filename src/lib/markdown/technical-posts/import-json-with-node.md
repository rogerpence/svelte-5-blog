---
title: Importing Json with Node static dynamic
description: Importing Json with Node static dynamic
date_created: '2025-08-10T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - json
---
## Static import

```
import markdownSearchData from '../data/search-index.json' with { type: 'json' };
```


## Dynamic import

```
import { pathToFileURL } from 'node:url';
import { ROOT } from './constants.js';

...

const src_location = path.join(ROOT, 'src/lib/data');
const jsonPath = path.join(src_location, 'search-index.json');
const markdownSearchData = await import(pathToFileURL(jsonPath).href, {
	with: { type: 'json' }
});

// Then reference markdownSearchData.default
```

`constants.js`

```
export const md_folders = ['kb', 'white-paper', 'case-study', 'newsletter', 'blog'];
export const locales = ['en', 'es'];
export const ROOT = 'C:\\Users\\thumb\\Documents\\projects\\asna\\_asna.com\\_project_ocho';
```