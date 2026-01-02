---
title: Using Typescript generics
description: Using Typescript generics
date_created: 2025-10-29T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - typescript
---
## User

[@helpers.ts](file:///C:/Users/thumb/Documents/projects/svelte/brainiac-cli/helpers.ts) [@validate.ts](file:///C:/Users/thumb/Documents/projects/svelte/brainiac-cli/validate.ts)

## User

[@helpers.ts](file:///C:/Users/thumb/Documents/projects/svelte/brainiac-cli/helpers.ts) [@validate.ts](file:///C:/Users/thumb/Documents/projects/svelte/brainiac-cli/validate.ts) 

How can I make the parseMarkdownFile function and its associated type ParsedMarkdown more generic so that I can dynamically type the frontMatter object. In this case i want to type it as TechnicalNoteFrontMatter

**Tool Call: Thinking**
Status: Completed


The user wants to make `parseMarkdownFile` and `ParsedMarkdown` generic so that they can specify a custom type for the frontMatter object, like `TechnicalNoteFrontMatter`.

Currently:
- `ParsedMarkdown` is an interface with `frontMatter: Record<string, any>`
- `parseMarkdownFile` returns `Promise<ParsedMarkdown>`

To make this generic, I should:
1. Add a type parameter to `ParsedMarkdown` interface
2. Add a type parameter to `parseMarkdownFile` function
3. Update `writeMarkdownFile` to also accept the generic type
4. Provide a default type parameter to maintain backward compatibility

The generic approach would look like:
```typescript
export interface ParsedMarkdown<T extends Record<string, any> = Record<string, any>> {
  frontMatter: T;
  content: string;
  rawFrontMatter?: string;
}

export const parseMarkdownFile = async <T extends Record<string, any> = Record<string, any>>(
  filename: string,
): Promise<ParsedMarkdown<T>> => {
  // ... existing implementation
  // The return type would be ParsedMarkdown<T>
}
```

This way, when the user calls it, they can do:
```typescript
const markdownObject = await parseMarkdownFile<TechnicalNoteFrontMatter>(fi.fullName);
// Now markdownObject.frontMatter is typed as TechnicalNoteFrontMatter
```

Let me provide a complete solution.


## Assistant

You can make both `ParsedMarkdown` and `parseMarkdownFile` generic by adding type parameters. Here's how to update `helpers.ts`:

```brainiac-cli/helpers.ts#L124-145
export interface ParsedMarkdown<T extends Record<string, any> = Record<string, any>> {
  frontMatter: T;
  content: string;
  rawFrontMatter?: string;
}

/**
 * Parses a markdown file with optional YAML frontmatter
 *
 * Extracts frontmatter delimited by `---` markers at the beginning of the file
 * and parses it as YAML. The remaining content is returned as plain text.
 *
 * @template T - The type of the frontmatter object
 * @param filename - The path to the markdown file to parse
 * @returns A promise that resolves to a ParsedMarkdown object containing the parsed frontmatter and content
 * @throws {Error} If the file cannot be read or parsing fails
 */
export const parseMarkdownFile = async <T extends Record<string, any> = Record<string, any>>(
  filename: string,
): Promise<ParsedMarkdown<T>> => {
```

And update the `writeMarkdownFile` function signature:

```brainiac-cli/helpers.ts#L195-199
export const writeMarkdownFile = async <T extends Record<string, any> = Record<string, any>>(
  parsedMarkdown: ParsedMarkdown<T>,
  outputFilename: string,
): Promise<void> => {
```

Now in `validate.ts`, you can use it like this:

```brainiac-cli/validate.ts#L30-34
const markdownObject = await parseMarkdownFile<MarkdownFrontmatter>(fi.fullName);

const frontMatter = convertFrontmatterDateStrings(markdownObject.frontMatter);
// frontMatter is now typed as MarkdownFrontmatter
// No need for explicit type annotation
```

**Key benefits:**

1. **Type safety**: TypeScript knows the exact shape of `frontMatter` based on your generic parameter
2. **Backward compatibility**: The default generic parameter `Record<string, any>` means existing code without the generic still works
3. **Flexibility**: You can use different frontmatter types for different markdown files (e.g., `TechnicalNoteFrontMatter`, `BlogPostFrontMatter`, etc.)

**Example usage with validation:**

```/dev/null/example.ts#L1-20
// Define your frontmatter type
type TechnicalNoteFrontMatter = {
  description: string;
  date_created: Date;
  date_updated: Date;
  tags: string[];
};

// Parse with the specific type
const markdownObject = await parseMarkdownFile<TechnicalNoteFrontMatter>(fi.fullName);

// TypeScript now knows frontMatter has the TechnicalNoteFrontMatter shape
const frontMatter = convertFrontmatterDateStrings(markdownObject.frontMatter);

// Update properties with full type safety
frontMatter.date_updated = fi.changed;
frontMatter.date_created = fi.created;

// TypeScript will catch errors if you try to access properties that don't exist
// frontMatter.nonexistent = "error"; // TS error!
```

## User

[@helpers.ts](file:///C:/Users/thumb/Documents/projects/svelte/brainiac-cli/helpers.ts) I think I need to type parsedFrontMatter on line 196 to T (or something like that!)

## Assistant

You're right! The `parsedFrontMatter` variable on line 196 should be typed as `T` to maintain type safety throughout the function. Here's the fix:

```brainiac-cli/helpers.ts#L196-197
    // Parse frontMatter YAML
    let parsedFrontMatter: T = {} as T;
```

And then update the return statement to properly type the object:

```brainiac-cli/helpers.ts#L213-217
    return {
      frontMatter: parsedFrontMatter as T,
      content: contentLines.join("\n"),
      rawFrontMatter: rawFrontMatter || undefined,
    };
```

However, there's a caveat: since `yaml.load()` returns `any`, we can't guarantee at runtime that the parsed YAML actually matches type `T`. This is a common pattern in TypeScript where you're asserting a type based on expected structure.

If you want more runtime safety, you'd typically use this in combination with Zod validation (which you're already doing in `validate.ts`):

```/dev/null/example.ts#L1-10
// Parse as unknown first
const markdownObject = await parseMarkdownFile(fi.fullName);

// Convert date strings
const convertedFrontMatter = convertFrontmatterDateStrings(markdownObject.frontMatter);

// Validate and parse with Zod
const result = MarkdownFrontmatterSchema.safeParse(convertedFrontMatter);
if (result.success) {
  const typedFrontMatter: MarkdownFrontmatter = result.data; // Now truly type-safe
```

Or, if you want to use the generic type parameter purely as a type hint (which is valid):

```/dev/null/example.ts#L1-5
// This tells TypeScript "I expect this shape" but doesn't validate at runtime
const markdownObject = await parseMarkdownFile<MarkdownFrontmatter>(fi.fullName);

// You still need Zod for runtime validation
const result = MarkdownFrontmatterSchema.safeParse(markdownObject.frontMatter);
```

The generic approach gives you better IDE autocomplete and compile-time checking, while Zod gives you runtime validation. Using both together is the most robust approach!


I thought 'parsed as T' was part of the solution. why are both parts of the ternary enclosed in parentheses and what is (`{} as T`) doing

Great questions! Let me break this down:

## Why parentheses around both parts?

The parentheses are needed because of operator precedence. Without them, TypeScript might parse the expression incorrectly. Here's what happens:

```/dev/null/example.ts#L1-8
// WITHOUT parentheses - ambiguous parsing
parsedFrontMatter = parsed && typeof parsed === "object" ? parsed as T : {} as T;
// TypeScript might interpret this as:
// (parsedFrontMatter = ... ? parsed as T : {}) as T

// WITH parentheses - clear intent
parsedFrontMatter = parsed && typeof parsed === "object" 
  ? (parsed as T)    // clearly the 'true' branch
  : ({} as T);       // clearly the 'false' branch
```

## What is `({} as T)` doing?

This is a **type assertion** (also called type casting). Let me explain:

1. **`{}`** - This creates an empty object literal of type `{}`
2. **`as T`** - This tells TypeScript "trust me, treat this as type `T`"
3. **`({}` `as T)`** - The parentheses ensure the type assertion applies to the object literal

So `({} as T)` is saying: "I'm creating an empty object, but TypeScript, please treat it as if it has the shape of type `T`."

### Why do we need this?

```/dev/null/example.ts#L1-15
// If T is defined as:
type MyFrontMatter = {
  title: string;
  date: Date;
}

// Then:
let parsedFrontMatter: T = {};  // ❌ ERROR! {} doesn't have title and date properties

let parsedFrontMatter: T = {} as T;  // ✅ OK! We're asserting the type

// At runtime, this object is still empty {}
// But TypeScript will now allow you to treat it as type T
// This is useful when you know the object will be populated later
// or when parsing external data where you can't guarantee the structure
```

**Important**: Type assertions like `as T` are purely compile-time. They don't do any runtime validation or conversion. That's why you need Zod validation afterward to ensure the data actually matches the expected shape!