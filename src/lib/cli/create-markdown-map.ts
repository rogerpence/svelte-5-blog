import * as utes from "./helpers.js"; 
import path from 'path';
import {getMarkdownObjects} from './get-markdown-objects.ts'

console.log('Creating markdown map')

const rootDir = utes.rootDir
const libDir = utes.libDir

const markDownDirectory = path.join(rootDir, '\\src\\markdown')
const outputDirectory = path.join(rootDir, '\\src\\lib\\data')
const outputFile = path.join(outputDirectory, 'markdown-map.ts')

const markdownObjects = await getMarkdownObjects(markDownDirectory);
console.log(`Writing ${markdownObjects.length} markdown objects to ${outputFile}`) 
utes.writeObjectsToFile(markdownObjects, outputFile, 'content')
process.exit(0);

