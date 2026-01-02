/**
 * Type-safe command line argument parser
 */

type ArgType = 'string' | 'number' | 'boolean';

type ArgDefinition<T extends ArgType> = {
	name: string;
	type: T;
	default?: T extends 'string' ? string : T extends 'number' ? number : boolean;
	required: boolean;
	value: T extends 'string' ? string | null : T extends 'number' ? number | null : boolean | null;
};

type ParsedArgs<T extends readonly ArgDefinition<ArgType>[]> = {
	[K in T[number]['name']]: Extract<T[number], { name: K }>['value'];
};

/**
 * Parses command line arguments and populates the argument definitions
 *
 * @template T - Array of argument definitions
 * @param {T} argDefs - Array of argument definitions to parse
 * @returns {ParsedArgs<T>} Object with parsed argument values
 *
 * @example
 * ```typescript
 * const cmdLineArgs = [
 *   { name: 'outputFile', type: 'string', default: 'output.txt', required: true, value: null },
 *   { name: 'lines', type: 'number', required: false, value: null }
 * ] as const;
 *
 * const args = parseCommandLineArgs(cmdLineArgs);
 * console.log(args.outputFile); // Type: string | null
 * console.log(args.lines);      // Type: number | null
 * ```
 */
export function parseCommandLineArgs<T extends readonly ArgDefinition<ArgType>[]>(
	argDefs: T
): ParsedArgs<T> {
	// Get command line arguments (skip first 2: node path and script path)
	const cliArgs = process.argv.slice(2);

	// TESTING!
	//const cliArgs = ['dummy1', 'dummy2', '-outputFile', 'roger', '-inputFile', 'pence'];

	// Create a mutable copy of definitions
	const defs = argDefs.map((def) => ({ ...def }));

	// Parse arguments
	for (let i = 0; i < cliArgs.length; i++) {
		const arg = cliArgs[i];

		// Check if it's a flag (starts with - or --)
		if (arg.startsWith('-')) {
			const argName = arg.replace(/^-+/, '');
			const def = defs.find((d) => d.name === argName); // get other keys associated with 'property'

			if (!def) {
				console.warn(`Unknown argument: ${argName}`);
				continue;
			}

			// Get the value (next argument)
			const valueStr = cliArgs[i + 1];

			if (def.type === 'boolean') {
				// For boolean, presence of flag means true
				def.value = true as any;
			} else if (!valueStr || valueStr.startsWith('-')) {
				console.error(`Missing value for argument: ${argName}`);
				process.exit(1);
			} else {
				i++; // Skip the value in next iteration

				if (def.type === 'number') {
					const numValue = Number(valueStr);
					if (isNaN(numValue)) {
						console.error(`Invalid number value for ${argName}: ${valueStr}`);
						process.exit(1);
					}
					def.value = numValue as any;
				} else {
					def.value = valueStr as any;
				}
			}
		}
	}

	// Check required arguments and apply defaults
	for (const def of defs) {
		if (def.value === null) {
			if ('default' in def && def.default !== undefined) {
				def.value = def.default as any;
			} else if (def.required) {
				console.error(`Missing required argument: ${def.name}`);
				process.exit(1);
			}
		}
	}

	// Build result object
	const result = {} as ParsedArgs<T>;
	for (const def of defs) {
		(result as any)[def.name] = def.value;
	}

	return result;
}

// // Example usage
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
