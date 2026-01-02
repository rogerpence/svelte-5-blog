---
title: Obsidian datavew versus datavewjs
description: Obsidian datavew versus datavewjs
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - obsidian
  - dataviewjs
---
Sometimes `Dataviewjs` queries are better than `Dataview` queries. This is especially true when you need case-insensitive or partial-match queries.

> [!info]
> The language specifier in the following code should either be `dataview` or `dataviewjs`. The `js` or `sql` identifiers used are for presentation purposes (and they keep Obsidian from thinking these queries should be active--instead of just showing the source code).

### Search tags

**dataview query**

Changing this query from a `dataview` to a `dataviewjs` query didn't buy very much. It mostly makes it easier to show a message when the `include_tag` is empty or not found.

```sql
TABLE WITHOUT ID
    file.link AS "Document",
    file.folder as "Folder",
    description AS "Description",
    join(tags, ", ") AS "Tags"
FROM "/"
WHERE contains(tags, this.include_tag)
SORT file.link ASC
```

dataviewjs query

```js
// --- Configuration ---
// Get the tag to search for from the current file's metadata (frontmatter)
const includeTag = dv.current().include_tag;

// --- Logic & Output ---
// 1. Check if the input tag is provided
if (!includeTag || typeof includeTag !== "string" || includeTag.trim() === "") {
    // Display message if includeTag is missing, not a string, or empty
    dv.paragraph(
        "⚠️ **Error:** Please enter a tag value in the `includetag` field in the frontmatter of this note."
    );
} else {
    // 2. Proceed only if includeTag is valid
    const includeTagLower = includeTag.trim().toLowerCase(); // Trim whitespace and lowercase for matching

    // Define the headers for the table
    const headers = ["Document", "Folder", "Description", "Tags"];

    // 3. Query pages, filter, sort, and map to table rows
    const pages = dv
        .pages('"/"') // Corresponds to FROM "/"
        .where((p) => {
            // Corresponds to WHERE clause - checking tags now
            // Check if the page HAS tags and if ANY tag matches the criteria
            return (
                p.tags &&
                Array.isArray(p.tags) &&
                p.tags.some(
                    (tag) =>
                        // Ensure the tag is a string before processing
                        typeof tag === "string" &&
                        // Convert page tag to lowercase and check if it starts with the input tag (case-insensitive prefix match)
                        tag.toLowerCase().startsWith(includeTagLower)
                )
            );
        })
        .sort((p) => p.file.link, "asc") // Corresponds to SORT file.link ASC
        .map((p) => [
            // Selects and formats the columns for the table
            p.file.link, // file.link AS "Document"
            p.file.folder, // file.folder as "Folder"
            p.description || "", // description AS "Description" (handle missing description)
            (p.tags || []).join(", "), // join(tags, ", ") AS "Tags" (handle missing tags)
        ]);

    // 4. Conditional Output
    if (pages.length > 0) {
        // Display the table if pages were found
        dv.table(headers, pages);
    } else {
        // Display a message if no pages were found matching the tag prefix
        dv.paragraph(
            `No documents found with a tag starting with "${includeTag}" (case-insensitive).`
        );
    }
}
```

**Changes and Explanation:**

1.  **Input Field:** Changed `dv.current().search` to `dv.current().includetag`.
2.  **Input Validation:** Added a more robust check:
    -   `!includeTag`: Checks if the field exists and isn't null/undefined.
    -   `typeof includeTag !== 'string'`: Ensures the value is actually text.
    -   `includeTag.trim() === ''`: Checks if the string is empty after removing leading/trailing whitespace.
    -   If any of these are true, the specific error message is shown.
3.  **Tag Processing:**
    -   `includeTag.trim().toLowerCase()`: The input tag is trimmed of whitespace and converted to lowercase _before_ the filtering starts.
4.  **Filtering Logic (`.where()`):**
    -   `p.tags && Array.isArray(p.tags)`: First, it checks if the page actually _has_ a `tags` field and if that field is an array (which it normally should be in Obsidian). This prevents errors.
    -   `.some(tag => ...)`: This array method checks if _at least one_ element in the `p.tags` array satisfies the condition inside the arrow function. It's efficient because it stops searching as soon as it finds a match.
    -   `typeof tag === 'string'`: Ensures the individual tag being checked is a string.
    -   `tag.toLowerCase().startsWith(includeTagLower)`: This is the core matching logic.
        -   `tag.toLowerCase()`: Converts the tag from the page to lowercase.
        -   `.startsWith(includeTagLower)`: Checks if the lowercased page tag _begins with_ the lowercased input tag. This performs the case-insensitive prefix match you wanted (e.g., "hel" matches "#Hello/There", "hello", "#help").
5.  **Output:** The rest of the query (headers, sorting, mapping, table display, "no results" message) remains largely the same structure, just adapted to reflect that we're searching tags now. The "no results" message is updated for clarity.

### Search file/desc

Converting this query from a `dataview` to a `dataviewjs` query increased its functionality quite a bit. With `dataview` you have to use `containwords` for case insensitive queries (`contains` isn't case sensitive and I had trouble trying to use JavaScript's `toLowerCase` with it). The `dataviewjs` query is better because:

-   it is case-insensitive
-   it works with partial search values

dataview query

```sql
TABLE WITHOUT ID
    file.link AS "Document",
    file.folder as "Folder",
    description AS "Description",
    join(tags, ", ") AS "Tags"
FROM "/"
WHERE containsword(file.name, this.search) OR containsword(description, this.search)
SORT file.link ASC
```

dataviewjs query

```js
// --- Configuration ---
// Get the search term from the current file's metadata (frontmatter)
const searchTerm = dv.current().search;

// --- Logic & Output ---
if (!searchTerm) {
    // Display error message if search term is missing
    dv.paragraph(
        "⚠️ **Error:** Please define a `search` field in the frontmatter of this note."
    );
} else {
    // Proceed only if searchTerm is defined
    const searchTermLower = searchTerm.toLowerCase(); // Convert search term for case-insensitive matching

    // Define the headers for the table
    const headers = ["Document", "Folder", "Description", "Tags"];

    // Query pages, filter, sort, and map to table rows
    const pages = dv
        .pages('"/"') // Corresponds to FROM "/"
        .where((p) => {
            // Corresponds to WHERE clause
            // Check if file name contains the search term (case-insensitive)
            const nameMatch = p.file.name
                .toLowerCase()
                .includes(searchTermLower);
            // Check if description exists and contains the search term (case-insensitive)
            // Added check for description existence and type safety
            const descriptionMatch =
                p.description &&
                typeof p.description === "string" &&
                p.description.toLowerCase().includes(searchTermLower);
            // Return true if either matches (OR condition)
            return nameMatch || descriptionMatch;
        })
        .sort((p) => p.file.link, "asc") // Corresponds to SORT file.link ASC
        .map((p) => [
            // Selects and formats the columns for the table
            p.file.link, // file.link AS "Document"
            p.file.folder, // file.folder as "Folder"
            p.description || "", // description AS "Description" (handle missing description)
            (p.tags || []).join(", "), // join(tags, ", ") AS "Tags" (handle missing tags)
        ]);

    // --- Conditional Output ---
    if (pages.length > 0) {
        // Display the table if pages were found
        dv.table(headers, pages);
    } else {
        // Display a message if no pages were found
        dv.paragraph(
            `No documents found containing "${searchTerm}" in the file name or description.`
        );
    }
}
```