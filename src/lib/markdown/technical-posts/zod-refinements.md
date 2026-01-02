---
title: Zod  refinements
description: Zod  refinements
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - zod
---
In Zod, `.regex()` and `.transform()` are **refinements** on the base string schema. The `dateFormatString` is using a combination of Zod's schema methods:

1. `z.string()` - Creates a base string schema
2. `.regex()` - Adds a pattern refinement
3. `.transform()` - (if used) Would transform the value after validation

Here's the breakdown of Zod methods being used:

```js
const dateFormatString = z
    .string() // Base schema
    .regex(
        // Refinement
        /^\d{4}-\d{2}-\d{2}$/,
        { message: "Date must be in the format YYYY-MM-DD" }
    );
```

If you wanted to also transform the string into a Date, you would add:

```js
const dateFormatString = z
    .string() // Base schema
    .regex(
        // Refinement
        /^\d{4}-\d{2}-\d{2}$/,
        { message: "Date must be in the format YYYY-MM-DD" }
    )
    .transform(
        (
            val // Transformation
        ) => new Date(val)
    );
```

The key differences:

-   `.regex()` is a **refinement** - it validates but doesn't change the value
-   `.transform()` is a **transformation** - it changes the value after validation
-   Both are part of Zod's "schema composition" pattern
    in Zod, the `.transform()` method returns the transformed value as the new value for that schema. Here's an example:

```js
import { z } from "zod";

const dateFormatString = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Date must be in the format YYYY-MM-DD",
    })
    .transform((val) => {
        const date = new Date(val);
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date string");
        }
        return date; // This becomes the new value
    });

// Using the schema:
const result = dateFormatString.parse("2023-04-16");
console.log(result); // Output: Date object for 2023-04-16
console.log(typeof result); // Output: "object" (Date object)
```

``
This means:

1. Input string "2023-04-16" is validated by the regex
2. If valid, it's passed to the transform function
3. Transform converts it to a Date object
4. The Date object becomes the final value
5. The type inference (`z.infer`) will show this as `Date` instead of `string`