---
title: information about Brainiac documents
description: information about Brainiac documents
date_created: '2025-10-27T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - brainiac
---
String date

```
type MarkdownFrontmatter = {
  description: string
  date_created: string
  date_updated: string
  date_published?: string
  tags: string[]
}
```

Date date

```
type MarkdownFrontmatter = {
  description: string
  date_created: Date
  date_updated: Date
  date_published?: Date
  tags: string[]
}
```

```
const markdownFrontmatterSchema = z.object({
  description: z.string(),
  date_created: z.string().datetime().or(z.coerce.date()),
  date_updated: z.string().datetime().or(z.coerce.date()),
  date_published: z.string().datetime().or(z.coerce.date()).optional(),
  tags: z.array(z.string())
})

type MarkdownFrontmatter = z.infer<typeof markdownFrontmatterSchema>
```