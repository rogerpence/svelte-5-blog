---
title: Creating a symbolic link with DOS mklink
description: Creating a symbolic link with DOS mklink
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - windows
  - utility
---
This command creates a symbolic link at `c:\Users\thumb\Documents\projects\link` that points to the `c:\Users\thumb\Documents\projects\original` folder:

```
mklink /D "c:\Users\thumb\Documents\projects\link" "c:\Users\thumb\Documents\projects\original"
```

You can work with folders from either directory. There is only one physical copy of the files and they are in the `orginal` folder. The `link` folder must not exist.

To delete the symbolic link, delete the linked folder. Do not delete the original!

In this example, the top is the original folder and the linked folder is below. Linked folders are shown in the File Explorer with a shortcut icon.

![[image-20.png|399x97]]

## Example

For this Sveltekit project:

```
C:\Users\thumb\Documents\projects\svelte\rp-blog
```

This mklink

```
mklink /D "C:\Users\thumb\Documents\projects\svelte\rp-blog\src\markdown\obs-tech" "C:\Users\thumb\Documents\resilio-envoy\Obsidian\brainiac\technical-posts"
```

created a symbolic for the `technical-posts` folder in the Obsidian Brainiac vault that makes it look like the Obsidian content lives in the SvelteKit project's folder structure:

![[image-21.png]]

The `obs-tech` folder points back to the Obsidian folder. This enables publishing that Obsidian content to the web and adding a search engine for it.

> [!danger]
> Remember that any changes made to the content in the `obs-tech` folder also changes the Obsidian source content. This includes adding and deleting files.