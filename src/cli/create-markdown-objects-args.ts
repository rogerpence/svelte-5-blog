import 'rp-utils/console';
import { parseCommandLineArgs } from './archive/cmd-args-lib';

import path from 'path';

import {
	writeObjectToFile,
	getMarkdownObjects,
	getAppPath,
	validateMarkdownObjects,
	writeTextFile,
	deleteFile
} from 'rp-utils';

import { TechnicalNoteFrontmatterSchema } from '../lib/types/app-types';

const cmdLineArgs = [
	{
		name: 'markdownObjectsInputPath',
		type: 'string' as const,
		required: true,
		value: ''
	},

	{
		name: 'markdownObjectsOutputFilename',
		type: 'string' as const,
		required: true,
		value: ''
	},
	{
		name: 'markdownValidationErrorOutputFilename',
		type: 'string' as const,
		required: true,
		value: ''
	},
	{
		name: 'frontMatterType',
		type: 'string' as const,
		required: true,
		value: ''
	}
] as const;

const args = parseCommandLineArgs(cmdLineArgs);

const outputPath = getAppPath(import.meta.url, 'src\\lib\\data');

const markdownOutputPath = path.join(outputPath, args.markdownObjectsOutputFilename);
const markdownValidationErrorsPath = path.join(
	outputPath,
	args.markdownValidationErrorOutputFilename
);

deleteFile(markdownOutputPath);
deleteFile(markdownValidationErrorsPath);

const markdownDataPath = getAppPath(
	import.meta.url,
	path.join('src', 'lib', args.markdownObjectsInputPath)
);

const { successful: markdownObjects, failed } = await getMarkdownObjects(markdownDataPath);

let markdownValidator;
if (args.frontMatterType.toString() === 'TechnicalNote') {
	markdownValidator = validateMarkdownObjects(markdownObjects, TechnicalNoteFrontmatterSchema);
}

if (!markdownValidator) {
	throw new Error(`Unsupported frontMatterType: ${args.frontMatterType}`);
}

const objs = markdownValidator.validatedObjects;

if (markdownValidator.filesFound !== markdownValidator.filesValid) {
	writeTextFile(markdownValidator.validationErrors.join('\n'), markdownValidationErrorsPath);
	console.error(
		`There were ${markdownValidator.filesFound - markdownValidator.filesValid} validation errors\nSee ${markdownValidationErrorsPath} for details.`
	);
} else {
	console.success(
		`${markdownValidator.filesFound} markdown typesafe objects written to\n${markdownDataPath}`
	);
}

writeObjectToFile(markdownObjects, markdownOutputPath);
