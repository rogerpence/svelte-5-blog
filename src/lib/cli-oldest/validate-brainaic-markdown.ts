import {
	type FullFileInfo,
	getFullFileInfo,
	convertFrontmatterDateStrings,
	parseMarkdownFile,
	writeMarkdownFile
} from './helpers.ts';

import path from 'path';

// import { type Post, type TagObject, get_tag_objects } from "./helpers.old.ts";

import * as z from 'zod';

const TechnicalNoteFrontmatterSchema = z.object({
	description: z.string(),
	date_created: z.string(),
	date_updated: z.string(),
	date_published: z.string().nullable().optional(),
	tags: z.array(z.string())
});

type TechnicalNoteFrontmatter = z.infer<typeof TechnicalNoteFrontmatterSchema>;

const folder =
	//    "C:\\Users\\thumb\\Documents\\projects\\svelte\\content-collection-2\\content\\technical-posts\\updated"
	//"C:\\Users\\thumb\\Documents\\projects\\svelte\\content-collection-2\\content\\technical-posts";
	'C:\\Users\\thumb\\Documents\\projects\\brainiac-technical-notes-backup';

//const outputFolder = path.join(folder, "updated");
const outputFolder =
	//"C:\\Users\\thumb\\Documents\\projects\\svelte\\content-collection-2\\content\\technical-posts\\updated";
	'C:\\Users\\thumb\\Documents\\resilio-envoy\\Obsidian\\brainiac\\technical-posts';

const fileInfo = getFullFileInfo(folder) ?? [];

const frontMatterObjects: Post[] = [];

await Promise.all(
	fileInfo.map(async (fi) => {
		//console.log(fi.fullName);
		const markdownObject = await parseMarkdownFile<TechnicalNoteFrontmatter>(fi.fullName);

		// const result = TechnicalNoteFrontmatterSchema.safeParse(
		//     markdownObject.frontMatter
		// );

		// if (!result.success) {
		//     console.log(`\n❌ Validation failure: ${fi.dirEntry.name}`);
		//     console.log(`File: ${fi.fullName}`);
		//     console.log("Errors:");
		//     result.error.issues.forEach((issue) => {
		//         console.log(`  - ${issue.path.join(".")}: ${issue.message}`);
		//     });
		// } else {
		//     console.info("success");
		// }
		// if (typeof markdownObject.frontMatter.date_updated == "object") {
		//     markdownObject.frontMatter.date_updated =
		//         markdownObject.frontMatter.date_updated.toLocaleDateString(
		//             "en-CA"
		//         );
		// }
		// if (typeof markdownObject.frontMatter.date_created == "object") {
		//     markdownObject.frontMatter.date_created =
		//         markdownObject.frontMatter.date_created.toLocaleDateString(
		//             "en-CA"
		//         );
		// }

		// try {
		//     markdownObject.frontMatter.date_updated =
		//         markdownObject.frontMatter.date_updated.substring(0, 10);
		//     markdownObject.frontMatter.date_created =
		//         markdownObject.frontMatter.date_created.substring(0, 10);
		// } catch (e) {
		//     console.log("ERROR=-------------------->", fi.dirEntry.name);
		//     console.log(e.message);

		//     process.exit(0);
		// }

		const empty = null;

		const newFm = {
			title: markdownObject.frontMatter.description,
			description: markdownObject.frontMatter.description,
			date_created: markdownObject.frontMatter.date_created,
			date_updated: markdownObject.frontMatter.date_updated,
			date_published: empty,
			pinned: false,
			tags: markdownObject.frontMatter.tags
		};

		markdownObject.frontMatter = newFm;

		frontMatterObjects.push(markdownObject.frontMatter);

		// const outputFilename = path.join(outputFolder, fi.dirEntry.name);
		// console.log(`----------> ${outputFilename}`);
		// writeMarkdownFile(markdownObject, outputFilename);

		//console.log(JSON.stringify(markdownObject, null, 4));
	})
);

//const tags = get_tag_objects(frontMatterObjects);
//console.log(tags);
