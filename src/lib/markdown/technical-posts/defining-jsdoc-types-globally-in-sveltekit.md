---
title: Defining JSDoc types globally in Sveltekit
description: Defining JSDoc types globally in Sveltekit
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - jsdoc
---
> [!question]
> If I name global.d.ts with the .ts extension, intellisense can't find the type. It can if I rename the file to global.d.js. Is that ok?

Yes, renaming the file to `global.d.js` works because it aligns with how JSDoc and JavaScript work together for type hinting. However, using `.js` instead of `.ts` has a few implications:

### 1. **Why `global.d.js` Works**

By renaming the file to `global.d.js` and using JSDoc syntax within it, you’re effectively providing type information directly in JavaScript, which allows editors like VS Code to pick up the types for IntelliSense. This works because JSDoc is designed to provide type annotations in plain JavaScript files.

### 2. **When to Use `.d.ts` vs `.d.js`**

-   **`.d.ts`** files are TypeScript declaration files specifically used for TypeScript projects to define types globally. These files are designed for TypeScript to know about types at compile time.
-   **`.d.js`** files are JavaScript files using JSDoc to declare types. This is often used when you’re not fully using TypeScript but still want strong IntelliSense support in JavaScript.

Since you're trying to make JSDoc work in your SvelteKit app, using `.d.js` with JSDoc annotations is perfectly fine, especially if you are not using full TypeScript.

### 3. **Considerations**

-   **Using `global.d.js`**: It's totally fine if you're sticking with JavaScript and JSDoc for type annotations. IntelliSense will work as expected, and the global types will be available across your SvelteKit app.
-   **Using `global.d.ts`**: If you want to migrate fully to TypeScript in the future, `global.d.ts` is the preferred method. You might need to troubleshoot why IntelliSense isn't picking it up if you're using `global.d.ts`. Ensure that your project is configured for TypeScript correctly (i.e., you have a `tsconfig.json` with the right settings).

### Conclusion:

It is absolutely fine to use `global.d.js` with JSDoc comments if you're primarily using JavaScript. If you plan to use TypeScript later, switching to `global.d.ts` and resolving IntelliSense issues might be a better long-term solution.