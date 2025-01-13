
import path from 'path';
import { dirname } from 'node:path';

const __dirname = dirname(__filename);
export const root = __dirname.replace("\\cli", "")



// console.log(root)
// console.log(path.resolve(root))

// const outputDirectory = path.join(path.resolve(root), '\\src\\lib\\data')
// const outputFile = path.join(outputDirectory, 'index-objects.ts')

