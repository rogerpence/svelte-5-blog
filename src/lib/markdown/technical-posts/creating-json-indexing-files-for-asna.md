---
title: Creating Json indexing files for ASNA.com site search
description: Creating Json indexing files for ASNA.com site search
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - asna
---
There are two existing Json files that provide data to the search engine:

### src\lib\data\search-index.json

which provides indexing info on markdown pages and is created by `create-search-data.js`. The input data for this comes from the `data\flatObjects.js` file.

### src\lib\data\search-index-pages.json

which provides indexing info on HTML pages is created by `generate-page-search-data.js`.

### src\lib\cmd-line\refresh-algolia-index.ps1

This PowerShell script calls `create-search-data.js` and `generate-page-search-data.js` to refresh the index data and then `refresh-algolia-index.js` to push the fresh search data to Algolia. `refresh-algolia-index.ps1` is called by `full-deploy.ps1`