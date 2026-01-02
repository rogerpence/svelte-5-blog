---
title: Zod technical notes and code fragments for creating interfaces and types with Zod.
description: Zod technical notes and code fragments for creating interfaces and types with Zod.
date_created: 2025-05-21T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - zod
---
[[svelte-forms-technical-notes|See this article for why you need Zod]]
## Zod versioning

Effective with Zod 3.25.0, the Zod binary includes both 3.x and 4.x versions.  I want to use v4 but asna.com is currently using v3.22. 

Import 3.x:

```
import { z } from "zod";
```

import 4.x

```
import { z } from "zod/v4";
```

## Create a type or interface from a Zod object

An example Zod object for an HTML form (this is one is for the ASNA Download's Family table). 

Note how you can create a type from the Zod object. This implies that you shouldn't explicitly create a type or interface for a form; rather, first create the Zod object and then derive the form type from that. You can't create a Zod object from a type or an interface.

Note that `created_at` is declared to Zod as optional. `created_at` needs to be the Zod object so that the inferred Family type includes `created_at`. It's optional because it won't be part of the form and shouldn't be necessary for form validation. 

```ts
export const FamilyZodSchema = z.object({
    id: z.string(), // Could add .uuid() if it's a UUID, or .regex(/^\d+$/) if numeric string
    created_at: z.coerce.date().optional(), // Coerces string/number to Date object
    name: z.string(),
    description: z.string(),
    visual_studio_version: z.string(),
    availability_id: z.string().nullable(), // .regex(/^\d+$/).nullable() if numeric string
    group_id: z.string().nullable(),       // .regex(/^\d+$/).nullable() if numeric string
    sort_order: z.number(),                // Could add .int().min(0) for example
    download_page_section_heading: z.string(),
    download_page_order: z.number(),       // Could add .int().min(0)
    release_date: z.coerce.date().nullable(), // Coerces string to Date, or allows null
});

export type Family = z.infer<typeof FamilyZodSchema>;

export type FamilyFormData = Omit<Family, 'id' | 'created_at'>;
```