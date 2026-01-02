import 'rp-utils/console';

import path from 'path';
import { writeMarkdownFile, getAppPath, getMarkdownObjects } from 'rp-utils';

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
