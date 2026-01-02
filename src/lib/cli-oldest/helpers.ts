import path from 'path';
import fs from 'fs';
import { promises as fsa } from 'fs';
import * as yaml from 'js-yaml';
import '$lib/cli-old/console-extensions';

/**
 * Converts date-like string values in a Frontmatter object to Date objects
 * Supports patterns: YYYY-MM-DD and YYYY-MM-DD HH:MM
 * @param obj - The object to process
 * @returns A new object with date strings converted to Date objects
 */
export const convertFrontmatterDateStrings = <T extends Record<string, any>>(obj: T): T => {
	// Regular expressions for the two date patterns
	const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
	const dateTimePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

	// Create a shallow copy of the object to avoid mutating the original
	const result = { ...obj };

	for (const [key, value] of Object.entries(result)) {
		// Only process string values
		if (typeof value === 'string') {
			// Check if the string matches either pattern
			// console.log(`replacement: ${value}`);
			if (dateOnlyPattern.test(value) || dateTimePattern.test(value)) {
				try {
					// Convert to Date object
					const dateValue = new Date(value);

					// Check if the date is valid
					if (isNaN(dateValue.getTime())) {
						throw new Error(`Invalid date: ${value}`);
					}

					// Replace the string value with the Date object
					(result as any)[key] = dateValue;
				} catch (error) {
					console.warn(`Failed to parse date for key "${key}" with value "${value}":`, error);
					// Continue processing other keys - don't modify this value
				}
			}
		}
	}

	return result;
};

export interface FullFileInfo {
	dirEntry: fs.Dirent;
	fullName: string;
	created: Date;
	modified: Date;
	changed: Date;
}

/**
 * Retrieves detailed file information for all entries in a directory
 *
 * Returns directory entries along with their creation, modification, and change timestamps.
 *
 * @param targetDirectory - The path to the directory to read
 * @returns An array of FullFileInfo objects, or undefined if the directory doesn't exist or an error occurs
 */
export const getFullFileInfo = (targetDirectory: string): FullFileInfo[] | undefined => {
	const result: FullFileInfo[] = [];
	try {
		// Check if directory exists synchronously
		if (!fs.existsSync(targetDirectory)) {
			console.log(`Directory does not exist: ${targetDirectory}`);
			return undefined;
		}

		// withFileNames: true causes array of Dirent's to be returned.
		const filenames: fs.Dirent[] = fs.readdirSync(targetDirectory, {
			withFileTypes: true
		});

		filenames.map((dirent) => {
			const fullName = path.join(dirent.parentPath, dirent.name);
			const stats = fs.statSync(fullName);
			result.push({
				dirEntry: dirent,
				fullName: path.join(dirent.parentPath, dirent.name),
				created: stats.birthtime,
				modified: stats.mtime,
				changed: stats.ctime
			});
		});

		return result;
	} catch (error) {
		console.log(error);
		return undefined;
	}
};

// export const getAllFileInfo = (targetDirectory: string): FullFileInfo[] | undefined => {
// 	const result = new Set<FullFileInfo>();

// 	try {
// 		// Check if directory exists synchronously
// 		if (!fs.existsSync(targetDirectory)) {
// 			console.log(`Directory does not exist: ${targetDirectory}`);
// 			return undefined;
// 		}

// 		// withFileNames: true causes array of Dirent's to be returned.
// 		const filenames: fs.Dirent[] = fs.readdirSync(targetDirectory, {
// 			withFileTypes: true
// 		});

// 		filenames.map((dirent) => {
// 			const fullName = path.join(dirent.parentPath, dirent.name);
// 			const stats = fs.statSync(fullName);
// 			result.push({
// 				dirEntry: dirent,
// 				fullName: path.join(dirent.parentPath, dirent.name),
// 				created: stats.birthtime,
// 				modified: stats.mtime,
// 				changed: stats.ctime
// 			});
// 		});

// 		return result;
// 	} catch (error) {
// 		console.log(error);
// 		return undefined;
// 	}
// };

/**
 * Retrieves directory entries for all files and subdirectories in a directory
 *
 * Returns an array of fs.Dirent objects which include file names and types
 * (file, directory, symbolic link, etc.) without additional filesystem stat information.
 *
 * @param targetDirectory - The path to the directory to read
 * @returns An array of fs.Dirent objects, or undefined if the directory doesn't exist or an error occurs
 */
export const getDirEntries = (targetDirectory: string): fs.Dirent[] | undefined => {
	try {
		// Check if directory exists synchronously
		if (!fs.existsSync(targetDirectory)) {
			console.log(`Directory does not exist: ${targetDirectory}`);
			return undefined;
		}

		// withFileNames: true causes array of Dirent's to be returned.
		const filenames: fs.Dirent[] = fs.readdirSync(targetDirectory, {
			withFileTypes: true
		});
		return filenames;
	} catch (error) {
		console.log(error);
		return undefined;
	}
};

// export interface ParsedMarkdown {
//   frontMatter: Record<string, any>; // More specific type for parsed YAML
//   content: string;
//   rawFrontMatter?: string; // Optional: keep raw frontMatter if needed
// }

/**
 * Recursively retrieves all file entries (not directories) for a directory tree
 *
 * Traverses the entire directory structure starting from targetDirectory,
 * returning fs.Dirent objects for all files found (excludes directories).
 *
 * @param targetDirectory - The path to the root directory to start traversal
 * @returns An array of fs.Dirent objects for files only, or undefined if an error occurs
 */
export const getAllDirEntries = (targetDirectory: string): fs.Dirent[] | undefined => {
	try {
		// Check if directory exists
		if (!fs.existsSync(targetDirectory)) {
			console.log(`Directory does not exist: ${targetDirectory}`);
			return undefined;
		}

		const allEntries = new Set<fs.Dirent>();

		// Read entries in current directory
		const entries = fs.readdirSync(targetDirectory, { withFileTypes: true });

		for (const entry of entries) {
			// If it's a directory, recursively get its file entries
			if (entry.isDirectory()) {
				const fullPath = path.join(entry.parentPath || targetDirectory, entry.name);
				const subEntries = getAllDirEntries(fullPath);

				if (subEntries) {
					subEntries.forEach((subEntry) => allEntries.add(subEntry));
				}
			} else if (entry.isFile()) {
				// Only add file entries (not directories)
				allEntries.add(entry);
			}
		}

		return Array.from(allEntries);
	} catch (error) {
		console.log(error);
		return undefined;
	}
};

export type WriteObjectToFileOptions = {
	exportName?: string;
	compressed?: boolean;
	log?: boolean;
};

/**
 * Writes a JavaScript object to a JSON file.
 *
 * @param {string} filePath - The path where the JSON file will be written
 * @param {unknown} object - The object to serialize and write to the file
 * @param {WriteObjectToFileOptions} [options] - Optional configuration
 * @param {string} [options.objectName] - A descriptive name for logging purposes
 * @param {boolean} [options.compressed=false] - If true, writes minified JSON without whitespace
 * @param {boolean} [options.log=true] - If true, logs success message to console
 *
 * @throws {Error} If the file cannot be written or the object cannot be serialized
 *
 * @example
 * Write with default options (formatted, logged):
 *   writeObjectToFile('data.json', myObject);
 *
 * @example
 * Write compressed without logging:
 *   writeObjectToFile('data.json', myObject, { compressed: true, log: false });
 *
 * @example
 * Write with custom name for logging:
 *   writeObjectToFile('index.json', indexObjects, { objectName: 'indexObjects' });
 */
export function writeObjectToFile(
	object: unknown,
	filePath: string,
	options?: WriteObjectToFileOptions
): void {
	const { compressed = false, log = true } = options ?? {};

	try {
		// Ensure directory exists
		const dir = path.dirname(filePath);
		if (!fs.existsSync(dir)) {
			console.error(`writeObjectToFile error:  ${dir} not found`);
			process.exit(1);
		}

		if (filePath.endsWith('.json') && options?.exportName) {
			console.error(`writeObjectToFile error:  Cannot not write to .json file with export name`);
			process.exit(1);
		}

		if (filePath.endsWith('.js') && !options?.exportName) {
			console.error(`writeObjectToFile error:  Must provide an export name for a .js`);
			process.exit(1);
		}

		const exportedName = options?.exportName ? `export const ${options?.exportName} = ` : '';

		// Serialize with appropriate formatting
		const json = compressed ? JSON.stringify(object) : JSON.stringify(object, null, 4);

		// Write to file
		fs.writeFileSync(filePath, `${exportedName}${json}`, 'utf-8');

		// Optional logging
		if (log) {
			console.success(`✓ Wrote ${filePath}`);
		}
	} catch (error) {
		console.error(`Failed to write file ${filePath}:`, error);
		throw error;
	}
}
