import '@rogerpence/rp-utils/console';

import path from 'path';
import fs, { write } from 'fs';
import { z } from 'zod';
import { fileURLToPath } from 'url';

import { truncatePathAfterDirectory } from '@rogerpence/rp-utils';

function getPathForCli(initialDirectory: string, ...segments: string[]): string {
	// Regardless of where this source file is located, results
	// are always under SvelteKit's 'src' folder.

	const currentFilePath = process.cwd();
	// if (!currentFilePath.includes('src')) {
	// 	console.error(`${initialDirectory} not in ${currentFilePath}`);
	// }

	const srcPath = truncatePathAfterDirectory(currentFilePath, initialDirectory);

	if (initialDirectory === 'src' && segments.length == 0) {
		//		segments.push();
		segments = ['lib', 'data', ...segments];
	}

	return path.join(srcPath, ...segments);
}

//console.log(getPathForCli('static'));

console.log(getPathForCli('bookmarks', 'one', 'two'));
