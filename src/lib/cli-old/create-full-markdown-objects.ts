import 'rp-utils/console';

import path from 'path';
import fs, { write } from 'fs';
import { z } from 'zod';
import { fileURLToPath } from 'url';

import {
	getAllDirEntries,
	parseMarkdownFile,
	writeObjectToFile,
	getPathForCli,
	writeTextFile,
	formatDateToYYYYMMDD
} from 'rp-utils';

import {
	TechnicalNoteFrontmatterSchema,
	type MarkdownDocument,
	type TechnicalNoteFrontmatter
} from '$lib/types/app-types';
import { error } from 'console';

type MarkdownFileResult<T> = {
	dirent: fs.Dirent;
	markdownObject: {
		frontMatter: T;
		content: string;
	};
};

type MarkdownObjectsCollection<T> = {
	filesFound: number;
	filesValid: number;
	collection: MarkdownFileResult<T>[];
};

type MarkdownObjectsValidtState = {
	filesFound: number;
	filesValid: number;
	validationErrors: string[];
};

/**
 * Retrieves and parses all Markdown files from a specified directory.
 *
 * Reads all `.md` files in the given folder, parses their frontmatter and content,
 * and returns an array of objects containing both the file system information (Dirent)
 * and the parsed Markdown data.
 *
 * @template T - The expected type of the frontmatter object (must extend Record<string, any>)
 * @param {string} folder - Path to the directory containing Markdown files (can be relative or absolute)
 * @returns {Promise<MarkdownFileResult<T>[]>} Array of objects containing file info and parsed Markdown data
 *
 * @example
 * Retrieve all technical notes from a folder
 * const notes = await getMarkdownObjects<TechnicalNoteFrontmatter>('../markdown');
 * console.log(`Found ${notes.length} markdown files`);
 *
 * @example
 * Access individual file information
 * const notes = await getMarkdownObjects<TechnicalNoteFrontmatter>('../markdown');
 * notes.forEach(note => {
 *   console.log(`File: ${note.dirent.name}`);
 *   console.log(`Title: ${note.markdownObject.frontMatter.title}`);
 * });
 */
async function getMarkdownObjects<T extends Record<string, any>>(
	folder: string
): Promise<MarkdownFileResult<T>[]> {
	const fileInfo: fs.Dirent[] = getAllDirEntries(folder) ?? [];

	const collectionResults = await Promise.all(
		fileInfo.map(async (fi) => {
			const fullFilename = path.join(fi.parentPath, fi.name);

			const markdownObject = await parseMarkdownFile<T>(fullFilename);

			return {
				dirent: fi,
				markdownObject
			};
		})
	);

	return collectionResults;
}

/**
 * Validates the frontmatter of parsed Markdown objects against a Zod schema.
 *
 * Iterates through a collection of Markdown file results and validates each file's
 * frontmatter against the provided schema. Logs validation errors to console and
 * optionally writes them to a text file for review.
 *
 * @template T - The expected type of the frontmatter object (must extend Record<string, any>)
 * @param {MarkdownFileResult<T>[]} objects - Array of parsed Markdown file results to validate
 * @param {z.ZodSchema<T>} schema - Zod schema to validate frontmatter against
 * @returns {MarkdownObjectsValidtState} Object containing validation statistics and error messages
 *
 * @example
 * Validate markdown objects and check results
 * const markdownObjects = await getMarkdownObjects<TechnicalNoteFrontmatter>('../markdown');
 * const validation = validateMarkdownObjects(markdownObjects, TechnicalNoteFrontmatterSchema);
 *
 * if (validation.filesFound === validation.filesValid) {
 *   console.log('All files valid!');
 * } else {
 *   console.log(`${validation.filesValid}/${validation.filesFound} files are valid`);
 * }
 *
 * @example
 * Handle validation errors
 * const validation = validateMarkdownObjects(objects, schema);
 * if (validation.validationErrors.length > 0) {
 *   console.error('Validation failed. Check error file for details.');
 * }
 */
function validateMarkdownObjects<T extends Record<string, any>>(
	objects: MarkdownFileResult<T>[],
	schema: z.ZodSchema<T>
): MarkdownObjectsValidtState {
	const validationErrors: string[] = [];
	const now = new Date();
	validationErrors.push(`${formatDateToYYYYMMDD(now)} ${now.toLocaleTimeString()}`);

	let filesFound = objects.length;
	let filesValid = 0;

	objects.map(async (obj) => {
		const result = schema.safeParse(obj.markdownObject.frontMatter);

		if (!result.success) {
			console.error(`\n❌ Validation failure: ${obj.dirent.name}`);
			const fullFilename = path.join(obj.dirent.name, obj.dirent.name);
			console.error(`File:${fullFilename}`);
			console.error('Errors:');
			result.error.issues.forEach((issue) => {
				console.warn(`  - ${issue.path.join('.')}: ${issue.message}`);
				validationErrors.push(`${fullFilename}  - ${issue.path.join('.')}: ${issue.message}`);
			});
		} else {
			filesValid++;
		}
	});

	if (validationErrors.length > 1) {
		const errorFilePath = getPathForCli('markdown-validation-errors.txt');
		writeTextFile(validationErrors.join('\n'), errorFilePath);
		console.error(`See validate error file: ${errorFilePath}`);
	}

	return {
		filesFound,
		filesValid,
		validationErrors
	};
}

async function getMarkdownCollection<T extends Record<string, any>>(
	folder: string,
	schema: z.ZodSchema<T>
): Promise<MarkdownObjectsCollection<T>> {
	const fileInfo: fs.Dirent[] = getAllDirEntries(folder) ?? [];

	const validationErrors: string[] = [];
	const now = new Date();
	validationErrors.push(`${formatDateToYYYYMMDD(now)} ${now.toLocaleTimeString()}`);

	const filesFound = fileInfo.length;
	let filesValid = 0;

	const collectionResults = await Promise.all(
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
					validationErrors.push(`${fullFilename}  - ${issue.path.join('.')}: ${issue.message}`);
				});
			} else {
				filesValid++;
			}
			return {
				dirent: fi,
				markdownObject
			};
		})
	);

	if (validationErrors.length > 1) {
		const errorFilePath = getPathForCli('markdown-validation-errors.txt');
		writeTextFile(validationErrors.join('\n'), errorFilePath);
		console.error(`See validate error file: ${errorFilePath}`);
	}

	return {
		filesFound,
		filesValid,
		collection: collectionResults
	};
}

// -------------------------------

const markdownDirectory = '..\\markdown';

const markdownObjects = await getMarkdownObjects<TechnicalNoteFrontmatter>(markdownDirectory);
const markdownValidator = validateMarkdownObjects(markdownObjects, TechnicalNoteFrontmatterSchema);

if (markdownValidator.filesFound === markdownValidator.filesValid) {
	const outputFilePath = getPathForCli('markdown-objects.json');
	console.success(`All markdown objects valid`);
	writeObjectToFile(markdownObjects, outputFilePath);
	console.success(`  Markdown objects written: ${markdownObjects.length}`);
} else {
	console.error(`Not all markdown file frontmatter is valid...`);
	console.error(`See the list above and fix.`);
}

/*

const markdownDirectory = '..\\markdown';

const markdownObjects = await getMarkdownCollection<TechnicalNoteFrontmatter>(
	markdownDirectory,
	TechnicalNoteFrontmatterSchema
);

console.info(`Markdown files found: ${markdownObjects.filesFound}`);
console.info(`Markdown files valid: ${markdownObjects.filesValid}`);

if (markdownObjects.filesFound === markdownObjects.filesValid) {
	const outputFilePath = getPathForCli('markdown-objects.json');
	
	writeObjectToFile(markdownObjects, outputFilePath);
	console.success(`Markdown objects written: ${markdownObjects.collection.length}`);
} else {
	console.error(`Not all markdown file frontmatter is valid...`);
console.error(`See the list above and fix.`);
}


*/
