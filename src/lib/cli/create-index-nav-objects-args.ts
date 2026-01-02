import 'rp-utils/console';
import { parseCommandLineArgs } from './archive/cmd-args-lib';
//import markdownObjectsData from '../data/markdown-objects.json';
import path from 'path';
import {
	type MarkdownDocument,
	writeObjectToFile,
	getAppPath,
	getSlug,
	sortObjArray,
	type IndexObject,
	type NavigationObject
} from 'rp-utils';
import { type TechnicalNoteFrontmatter } from '$lib/types/app-types';
// Remove markdown formatting from document for indexing purposes.
import removeMd from 'remove-markdown';

const cmdLineArgs = [
	{
		name: 'markdownObjectsInputFile',
		type: 'string' as const,
		required: true,
		value: ''
	},

	{
		name: 'indexObjectsOutputFilename',
		type: 'string' as const,
		required: true,
		value: ''
	},
	{
		name: 'navObjectsOutputFilename',
		type: 'string' as const,
		required: true,
		value: ''
	}
] as const;

const args = parseCommandLineArgs(cmdLineArgs);

// console.log(args.markdownObjectsInputFile);
// console.log(args.indexObjectsOutputFilename);
// console.log(args.navObjectsOutputFilename);

// process.exit();

const markdownObjectsData = await import(`../data/${args.markdownObjectsInputFile}`);

const markdownObjects = markdownObjectsData.default as MarkdownDocument<TechnicalNoteFrontmatter>[];

const indexObjects: IndexObject<TechnicalNoteFrontmatter>[] = markdownObjects.reduce((acc, obj) => {
	const slug = path.join(obj.dirent.parentPath, obj.dirent.name);
	const folder = '';
	const o = {
		title: obj.markdownObject.frontMatter.title,
		description: obj.markdownObject.frontMatter.description,
		date_created: obj.markdownObject.frontMatter.date_created,
		date_updated: obj.markdownObject.frontMatter.date_updated,
		date_published: obj.markdownObject.frontMatter.date_published,
		pinned: obj.markdownObject.frontMatter.pinned,
		tags: obj.markdownObject.frontMatter.tags,
		content: removeMd(obj.markdownObject.content),
		locale: 'en',
		slug: getSlug(obj.dirent.parentPath, obj.dirent.name),
		folder: folder
	};
	acc.push(o);
	return acc;
}, [] as IndexObject<TechnicalNoteFrontmatter>[]);

const navigationObjects: NavigationObject<TechnicalNoteFrontmatter>[] = indexObjects.map(
	({ content, ...rest }) => rest
);

const outputPath = path.join(getAppPath(import.meta.url, 'src\\lib\\data'));

// Index objects output file name
writeObjectToFile(indexObjects, path.join(outputPath, args.indexObjectsOutputFilename));
console.success(
	`${indexObjects.length} index objects written to\n${path.join(outputPath, args.indexObjectsOutputFilename)}`
);

const sortedData = sortObjArray(navigationObjects, ['title'], ['asc']);

// Nav objects output file name
writeObjectToFile(sortedData, path.join(outputPath, args.navObjectsOutputFilename));
console.success(
	`${sortedData.length} navigation-objects written to\n${path.join(outputPath, args.navObjectsOutputFilename)}`
);
