import './console-extensions.ts';

//import { getAllDirEntries, parseMarkdownFile, writeObjectToFile } from './helpers';
//import { getAllDirEntries, parseMarkdownFile } from './helpers.ts';

import { getAllDirEntries, writeObjectToFile, parseMarkdownFile } from 'rp-utils';

import {
	TechnicalNoteFrontmatterSchema,
	type MarkdownDocument,
	type TechnicalNoteFrontmatter
} from '$lib/cli-old/markdown-types.ts';

import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import { fileURLToPath } from 'url';

const folder = '..\\markdown';

type MarkdownFileResult<T> = {
	dirent: fs.Dirent;
	markdownObject: {
		frontMatter: T;
		content: string;
	};
};

function getVirtualPath(filePath: string): string {
	const urlPath = filePath
		.replace(/\\/g, '/') // Replace all backslashes with forward slashes
		.replace(/^\.\.\//, ''); // Remove leading ../

	return `/${urlPath}`;
}

function getBaseSlug(filename: string): string {
	return filename.replace(/\.[^.]+$/, '');
}

function getSlug(obj: fs.Dirent): string {
	const virtualPath = getVirtualPath(obj.parentPath);
	const baseSlug = getBaseSlug(obj.name);

	return `${virtualPath}/${baseSlug}`;
}

function stripMarkdown(markdown: string): string {
	return markdown
		.replace(/^#{1,6}\s+/gm, '') // Remove headers
		.replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
		.replace(/\*(.+?)\*/g, '$1') // Remove italic
		.replace(/\_(.+?)\_/g, '$1') // Remove italic
		.replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links, keep text
		.replace(/`(.+?)`/g, '$1') // Remove inline code
		.replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
		.replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
		.trim();
}

async function validateMarkdownFiles<T extends Record<string, any>>(
	folder: string,
	schema: z.ZodSchema<T>
): Promise<MarkdownFileResult<T>[]> {
	const fileInfo: fs.Dirent[] = getAllDirEntries(folder) ?? [];

	const results = await Promise.all(
		fileInfo.map(async (fi) => {
			const fullFilename = path.join(fi.parentPath, fi.name);

			const markdownObject = await parseMarkdownFile<T>(fullFilename);

			const result = schema.safeParse(markdownObject.frontMatter);

			if (!result.success) {
				console.error(`\n❌ Validation failure: ${fi.name}`);
				console.error(`File: ${fullFilename}`);
				console.error('Errors:');
				result.error.issues.forEach((issue) => {
					console.warn(`  - ${issue.path.join('.')}: ${issue.message}`);
				});
			} else {
				console.success('success');
			}

			return {
				dirent: fi,
				markdownObject
			};
		})
	);

	return results;
}

const x = await validateMarkdownFiles<TechnicalNoteFrontmatter>(
	folder,
	TechnicalNoteFrontmatterSchema
);

// for (const obj of x) {
// 	console.jsonString(obj.markdownObject.frontMatter);
// }

process.exit(1);

const contentObjects = new Map<number, MarkdownDocument>();

let counter = 0;
x.forEach(({ dirent, markdownObject }) => {
	contentObjects.set(counter++, {
		title: markdownObject.frontMatter.title,
		description: markdownObject.frontMatter.description,
		date_updated: markdownObject.frontMatter.date_updated,
		//date_updated: new Date(markdownObject.frontMatter.date_updated),
		pinned: markdownObject.frontMatter.pinned,
		folder: dirent.parentPath,
		filename: dirent.name,
		slug: getSlug(dirent),
		tags: markdownObject.frontMatter.tags,
		content: stripMarkdown(markdownObject.content)
	});
});

const objs: MarkdownDocument[] = Array.from(contentObjects.values());

const indexObjects: MarkdownDocument[] = objs.map((obj) => ({
	...obj,
	content: ''
}));

// const indexObjects: MarkdownDocument[] = objs.map(obj => ({
//     title: obj.title,
//     description: obj.description,
//     date_updated: obj.date_updated,
//     pinned: obj.pinned,
//     folder: obj.folder,
//     filename: obj.filename,
//     slug: obj.slug,
//     tags: obj.tags,
//     content: ''
// }));

console.jsonString(indexObjects);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, folder, 'output', 'test.json');

//writeObjectToFile(indexObjects, outputPath, { exportName: 'myobj', log: false });
writeObjectToFile(objs, outputPath, { log: false });
