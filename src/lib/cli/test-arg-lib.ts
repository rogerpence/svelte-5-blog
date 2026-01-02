import 'rp-utils/console';
import { parseCommandLineArgs } from './archive/cmd-args-lib';

// const cmdLineArgs = [
// 	{
// 		name: 'outputFile',
// 		type: 'string',
// 		default: 'output.text',
// 		required: true,
// 		value: null
// 	},
// 	{
// 		name: 'inputFile',
// 		type: 'string',
// 		required: true,
// 		value: null
// 	},
// 	{
// 		name: 'lines',
// 		type: 'number',
// 		default: 275,
// 		required: false,
// 		value: null
// 	}
// ] as const;

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

// Parse the arguments
const args = parseCommandLineArgs(cmdLineArgs);
console.jsonString(args);

// Now you can use the arguments with full type safety
// console.log('Output File:', args.outputFile);
// console.log('Input File:', args.inputFile);
// console.log('Lines:', args.lines);

// // Type-safe access - TypeScript knows the types!
// if (args.lines !== null) {
// 	console.log(`Processing ${args.lines} lines`);
// }
