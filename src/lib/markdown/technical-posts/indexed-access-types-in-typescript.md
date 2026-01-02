---
title: Indexed access types in TypeScript
description: Indexed access types in TypeScript
date_updated: '2025-12-04T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - typescript
---
```ts
  export type MarkdownParseResult<T> = {
    successful: MarkdownFileResult<T>[];
    failed: Array<{
        filename: string;
        dirent: fs.Dirent;
        error: string;
    }>;
};

export async function getMarkdownObjects<T extends Record<string, any>>(
    folder: string
): Promise<MarkdownParseResult<T>> {
    const fileInfo: fs.Dirent[] = getAllDirEntries(folder) ?? [];

    const successful: MarkdownFileResult<T>[] = [];
    const failed: MarkdownParseResult<T>["failed"] = [];

    await Promise.all(
        fileInfo.map(async (fi) => {
            const fullFilename = path.join(fi.parentPath, fi.name);
            const result = await parseMarkdownFile<T>(fullFilename);

            if (result.success) {
                successful.push({
                    dirent: fi,
                    markdownObject: result.data,
                });
            } else {
                failed.push({
                    filename: fullFilename,
                    dirent: fi,
                    error: result.error,
                });
            }
        })
    );

    return { successful, failed };
}
```

In the code above, this line:

```ts
const failed: MarkdownParseResult<T>["failed"] = [];
```

`["failed"]` Indexes into the `MarkdownParseResult` type to get the type of the [failed](vscode-file://vscode-app/c:/Users/thumb/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) property. Doing this, `failed` is an array of 

```
failed: Array<{
	filename: string;
	dirent: fs.Dirent;
	error: string;
}>;
```