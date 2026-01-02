---
title: bulk-markdown-modify
description: How to perform bulk changes to markdown files in a folder
date_updated: 2025-12-17
date_created: 2025-02-02
date_published:
pinned: false
tags:
  - markdown
---
This code lets you make bulk changes to the markdown documents in a folder. 

I needed to remove the first H1 line in each file in a folder full of markdown files.  I wrote this code, with its critical parts coming from the `rp-util` library to make that bulk change. 

I left the code for that specific change intact, but you can change the code to make change necessary to markdown file object.

> [!info]
> This code can also be found in the `lib/cli/revise-markdown-docs.ts` file.

```ts
import 'rp-utils/console';

import path from 'path';
import { writeMarkdownFile, getAppPath, getMarkdownObjects } from '@rogerpence/rp-utils';

interface ParsedMarkdown<T extends Record<string, any> = Record<string, any>> {
	content: string;
	frontMatter: T;
}

// Get input path of markdown files.
const inputPath = getAppPath(import.meta.url, 'src\\lib\\markdown\\technical-posts');

// Fetch type that getMarkdownObjects returns.
type MarkdownParseResult = Awaited<ReturnType<typeof getMarkdownObjects>>;

const { successful: markdownObjects, failed }: MarkdownParseResult =
	await getMarkdownObjects(inputPath);

const outputPath = getAppPath(import.meta.url, 'src\\lib\\data\\temp');

// markdownObjects is type MarkdownFileResult[].
// See this: https://rogerpence.github.io/rp-utils/types/types.MarkdownFileResult.html

// Iterate over each markdown object.
markdownObjects.map((obj) => {
	// Make changes needed to the incoming markdown object.
	// Change the 'obj' object before calling 'writeMarkDownFile.

	// You can add, delete, or change frontmatter keys and modify the content.

	// Add a new frontmatter key and value.
	// obj.markdownObject.frontMatter['bib'] = 'dib';

	// Delete a frontmatter key and value.
	// delete obj.markdownObject.frontMatter['description'];

	// Change a frontmatter value.
	// obj.markdownObject.frontMatter['description'] = 'Neil Young';

	// This change modifies the content property by removing
	// removes the first line that starts with '# ' in the markdown content.
	let newContent: string[] = [];
	let currentContent: string[] = [];
	let firstH1Found = false;

	newContent = obj.markdownObject.content.split('\n');

	newContent.forEach((line) => {
		if (line.startsWith('# ') && !firstH1Found) {
			firstH1Found = true;
		} else {
			currentContent.push(line);
		}
	});

	// Assign new content.
	obj.markdownObject.content = currentContent.join('\n').trim();

	writeMarkdownFile(obj.markdownObject, path.join(outputPath, obj.dirent.name));
});
```

  