---
title: rp blog sveltekit blog engine
description: rp blog sveltekit blog engine
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
## Create mark-map.ts file

`create-markdown-map.ts` produces the `markdown-map.ts` file, which is an array of the object below. `create-markdown-map.ts` imports the `getMarkdownObjects` function from `get-markdown-objects.ts`

```
{
	"data": {
		"frontMatter": {
			"title": "Test post 13",
			"description": "This is test post 13",
			"tags": [
				"test13"
			],
			"date_added": "2025-01-25T04:15:16.000Z",
			"date_updated": "2025-01-25T04:15:16.000Z",
			"date_published": null,
			"pinned": false
		},
		"content": "This is test post 13"
	},
	"mapInfo": {
		"success": true,
		"errorType": "No error",
		"status": "success",
		"fullPath": "C:\\Users\\thumb\\Documents\\projects\\svelte\\rp-blog\\src\\markdown\\posts\\test-post-13.md",
		"slug": "/posts/test-post-13",
		"folder": "posts"
	}
},
```

A TypeScript type definition for the JSON object above. It is broken down into a few interfaces for better organization and readability.

```typescript
interface FrontMatter {
  title: string;
  description: string;
  date_published:
tags: string[];
  date_added: string; // ISO 8601 date string
  date_updated: string; // ISO 8601 date string
  date_published: string | null; // ISO 8601 date string or null
  pinned: boolean;
}

interface DataObject {
  frontMatter: FrontMatter;
  content: string;
}

interface MapInfo {
  success: boolean;
  errorType: string; // Could be a literal type like "No error" | "File not found" if known
  status: string;    // Could be a literal type like "success" | "failure" if known
  fullPath: string;
  slug: string;
  folder: string;
}

interface BlogPostResponse { // You can name this root type as you see fit
  data: DataObject;
  mapInfo: MapInfo;
}

// Example usage (optional, for demonstration):
const exampleJson: BlogPostResponse = {
    "data": {
        "frontMatter": {
            "title": "Test post 13",
            "description": "This is test post 13",
            "tags": [
                "test13"
            ],
            "date_added": "2025-01-25T04:15:16.000Z",
            "date_updated": "2025-01-25T04:15:16.000Z",
            "date_published": null,
            "pinned": false
        },
        "content": "This is test post 13"
    },
    "mapInfo": {
        "success": true,
        "errorType": "No error",
        "status": "success",
        "fullPath": "C:\\Users\\thumb\\Documents\\projects\\svelte\\rp-blog\\src\\markdown\\posts\\test-post-13.md",
        "slug": "/posts/test-post-13",
        "folder": "posts"
    }
};

console.log(exampleJson.data.frontMatter.title);
console.log(exampleJson.mapInfo.slug);
```

**Key points:**

1.  **`FrontMatter`**: Describes the metadata of your content.
    -   `date_added`, `date_updated`, `date_published`: Typed as `string` because they are ISO 8601 date strings in the JSON. If you parse them into `Date` objects in your application, you might adjust the type there, but for representing the JSON itself, `string` is accurate. `date_published` can also be `null`.
2.  **`DataObject`**: Contains the `frontMatter` and the main `content`.
3.  **`MapInfo`**: Contains metadata about the file/mapping process.
    -   `errorType` and `status`: Typed as `string`. If you have a fixed set of possible values for these (e.g., `status: "success" | "error"`), you can make them more specific using literal types.
4.  **`BlogPostResponse`**: The root type that combines `data` and `mapInfo`. You can choose a more descriptive name for this depending on your application's context (e.g., `MarkdownFileProcessed`, `ApiPostResponse`, etc.).

This structure should accurately type your JSON object.