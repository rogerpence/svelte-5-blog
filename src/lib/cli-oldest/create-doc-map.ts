import './console-extensions.ts';
import {
	type FullFileInfo,
	getFullFileInfo,
	convertFrontmatterDateStrings,
	parseMarkdownFile,
	writeMarkdownFile
} from './helpers.ts';

import {
	TechnicalNoteFrontmatterSchema,
	type TechnicalNoteFrontmatter
} from '$lib/cli-old/markdown-types.ts';

import path from 'path';

const folder = '..\\markdown\\posts';

const outputFolder =
	//"C:\\Users\\thumb\\Documents\\projects\\svelte\\content-collection-2\\content\\technical-posts\\updated";
	'C:\\Users\\thumb\\Documents\\resilio-envoy\\Obsidian\\brainiac\\technical-posts';

async function validateMarkdownFiles<T extends Record<string, any>>(folder: string) {
	const fileInfo = getFullFileInfo(folder) ?? [];

	await Promise.all(
		fileInfo.map(async (fi) => {
			const markdownObject = await parseMarkdownFile<T>(fi.fullName);

			const result = TechnicalNoteFrontmatterSchema.safeParse(markdownObject.frontMatter);

			if (!result.success) {
				console.error(`\n❌ Validation failure: ${fi.dirEntry.name}`);
				console.error(`File: ${fi.fullName}`);
				console.error('Errors:');
				result.error.issues.forEach((issue) => {
					console.warn(`  - ${issue.path.join('.')}: ${issue.message}`);
				});
			} else {
				console.success('success');
			}
		})
	);
}

await validateMarkdownFiles<TechnicalNoteFrontmatter>(folder);

console.info('all done');
