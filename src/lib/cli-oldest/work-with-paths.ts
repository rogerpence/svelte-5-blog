import { fileURLToPath } from 'url';
import path from 'path';

import {
	getRelativePath,
	getPathForCli,
	truncatePathAfterDirectory
} from '$lib/cli-old/_filesystem';

const fullFilePath = fileURLToPath(import.meta.url);

// You can also get the directory:
const __dirname = path.dirname(fullFilePath);

// console.log('Full file path:', fullFilePath);
// console.log('Directory:', __dirname);

//console.log(getRelativePath());

let x = getPathForCli('test.json');
console.log(x);

x = getPathForCli('markdown', 'kb', 'test.json');
console.log(x);

console.log(truncatePathAfterDirectory(`c:\\one\\two\\three\\test.json`, 'twodd'));
