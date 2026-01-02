---
title: Change editor width in Obsidian
description: Change editor width in Obsidian
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-17
date_published:
pinned: false
tags:
  - obsidian
---
Find the vault root folder. In my case, it is:

```
C:\Users\thumb\Documents\Dropbox\synctest\obsidian-db
```

where `obsidian-db` is the name of my vault.(Also, in my case, `Dropbox\synctest` is folder synchronized with Dropboxxx.

```
.
└── ...Dropbox
    └── synctest
        └── obsidian-db (vault name)
            └── .obsidian
                └── snippets
                    └── obsidian.css
```

Navigate to the vault's `snippets` folder and add or modify the `obsidian.css` file to include (adjust `max-width` to your preference).

```css
.markdown-source-view,
.markdown-preview-view {
    max-width: 1200px;
    margin: auto;
}
```

In the Obsidian settings, set `Editor > Readable Line Length` to off.