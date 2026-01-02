import 'rp-utils/console';

/**
 * This revises the asna.com kb articles frontmatter schema.
 */

import path from 'path';
import { writeMarkdownFile, getAppPath, getMarkdownObjects } from 'rp-utils';

interface ParsedMarkdown<T extends Record<string, any> = Record<string, any>> {
	content: string;
	frontMatter: T;
}

// Get input path of markdown files.
const inputPath = getAppPath(import.meta.url, 'src\\lib\\markdown\\kb');

// Fetch type that getMarkdownObjects returns.
type MarkdownParseResult = Awaited<ReturnType<typeof getMarkdownObjects>>;

const { successful: markdownObjects, failed }: MarkdownParseResult =
	await getMarkdownObjects(inputPath);

const outputPath = getAppPath(import.meta.url, 'src\\lib\\data\\temp');

function isDate(value: unknown) {
	return value instanceof Date;
}

function convertDateToString(value: any) {
	let result = null;
	try {
		if (isDate(value)) {
			result = value.toISOString();
		} else if (value.endsWith('T')) {
			result = value.slice(0, -1);
			result = new Date(value).toISOString();
		} else if (value == '') {
			return '';
		} else {
			result = new Date(value).toISOString();
		}
	} catch (ex: any) {
		console.log(ex.message);
	}

	return result;
}

// markdownObjects is type MarkdownFileResult[].
// See this: https://rogerpence.github.io/rp-utils/types/types.MarkdownFileResult.html

// Iterate over each markdown object.
markdownObjects.map((obj, index) => {
	let dateCreated;
	let dateUpdated;
	let datePublished;

	try {
		dateCreated = convertDateToString(obj.markdownObject.frontMatter.date_added);
		dateUpdated = convertDateToString(obj.markdownObject.frontMatter.date_updated);
		datePublished = convertDateToString(obj.markdownObject.frontMatter.date_published);
	} catch (ex) {
		console.log(index, obj.markdownObject.frontMatter.title);
		process.exit();
	}

	obj.markdownObject.frontMatter['date_created'] = new Date(dateCreated).toISOString();
	obj.markdownObject.frontMatter.date_updated = new Date(dateUpdated).toISOString();
	obj.markdownObject.frontMatter.date_published = new Date(datePublished).toISOString();

	obj.markdownObject.frontMatter['pinned'] = false;

	delete obj.markdownObject.frontMatter.series;
	delete obj.markdownObject.frontMatter.url;
	delete obj.markdownObject.frontMatter.image;
	delete obj.markdownObject.frontMatter.type;
	delete obj.markdownObject.frontMatter.abstract;
	delete obj.markdownObject.frontMatter.translated;
	delete obj.markdownObject.frontMatter.date_added;
	delete obj.markdownObject.frontMatter.draft;

	// if (!Object.hasOwn(obj.markdownObject.frontMatter, 'series')) {
	// 	obj.markdownObject.frontMatter['series'] = null;
	// }

	// Change a frontmatter value.
	// obj.markdownObject.frontMatter['description'] = 'Neil Young';

	// This change modifies the content property by removing
	// removes the first line that starts with '# ' in the markdown content.

	/*
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
	*/

	writeMarkdownFile(obj.markdownObject, path.join(outputPath, obj.dirent.name));
});

console.log('done');
