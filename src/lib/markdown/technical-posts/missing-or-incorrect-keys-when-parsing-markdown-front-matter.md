---
title: Missing or incorrect keys when parsing markdown front matter
description: Missing or incorrect keys when parsing markdown front matter
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - zod
  - markdown
---
This is a Zod schema for markdown blog post. Using this, you can ensure that a markdown document is type safe.
Note how the schema ends with `.strict()`; this ensures that the schema doesn't have extra or missing keys (it can have optional keys marked with the `.optional()` method).

```
import { z } from 'zod';

const dateFormatString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {message: "Date must be in the format YYYY-MM-DD"})

export const RPBlogSchema = z.object({
    title: z.string().min(1, 'Title cannot be empty'),
    description: z.string().min(1, 'Description cannot be empty'),
    date_created: 2025-01-05 12:00
date_updated: 2025-01-05 12:00
date_published:
tags: z.array(z.string()).min(1, 'At least one tag is required'),
    date_added: z.union([dateFormatString,  z.date(), z.null()]),
    date_updated: z.union([dateFormatString, z.date(), z.null()]),
    date_published: z.union([dateFormatString, z.date(), z.null()]),
    pinned: z.boolean()
}).strict();

export type RPBlogPost = z.infer<typeof RPBlogSchema>;
```

At first, I missed the `.strict()` method and added my own logic to look for extra or missing keys. The code to do this is included in an early version of the `getMarkdownObject()` method. I'm saving the code here mostly just for future reference.

```
export const getMarkdownObject = <T>(frontMatter: string[], content: string[], schema: z.ZodType<T>): MarkdownResult<T> => {
  try {
    const parsed: any = yaml.load(frontMatter.join('\n'));

    // If the schema is strict, you don't need to check for missing or extra fields.

	// Code not needed: start
	// const objectFields = Object.keys(parsed);
    // const schemaShape = schema.shape as { [k: string]: z.ZodTypeAny };
    // const requiredFields = Object.entries(schemaShape)
    //     .filter(([_, type]) => !type.isOptional())
    //      .map(([field]) => field);

    // // checking array for presence of required fields. (uses includes method)
    // const missingFields = requiredFields.filter(field => !objectFields.includes(field));

    // // checking schema object for presence of extra fields. (uses in operator)
    // const extraFields = objectFields.filter(field => !(field in schemaShape));

    // if (missingFields.length > 0 || extraFields.length > 0) {
    //   const errors = [];
    //   if (missingFields.length) errors.push(`Missing required field(s): ${missingFields.join(', ')}`);
    //   if (extraFields.length) errors.push(`Extra field(s): ${extraFields.join(', ')}`);

    //   return {
    //     success: false,
    //     errorType: 'Missing/extra field(s)',
    //     status: errors.join(';'),
    //     message: errors.join(';')
    //    };
    // }
  	// Code not needed: end

    const fm = schema.parse(parsed);
    return {
      success: true,
      data: {
        frontMatter: fm,
        content: content.join('\n'),
      },
      errorType: 'No error',
      status: 'success'
    };

  } catch (error: any ) {
    // let message = "Unknown error"
    let status = 'Unknown error'
    if (error.issues) {
        status = getZodErrorMessage(error)
    }

    return {
      success: false,
      errorType: "Parsing error",
      status,
      issues: error.issues ?? ''
    };
  }
};
```