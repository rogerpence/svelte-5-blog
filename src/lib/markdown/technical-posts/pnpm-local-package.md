---
title: pnpm-local-package
description: How to create and use a local PNPM package
date_updated: '2025-12-14T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - pnpm
---
Typical workflow

1. Make changes to utils. 
2. Update `version` in package.json: `"1.0.1"` → `"1.0.2"`
3. Commit: `git commit -m "v1.0.2: Added new helper functions"`
4. Tag: `git tag v1.0.2`
5. Push: `git push && git push --tags`


In consuming app 

Do this from the command line for the consuming project:
`pnpm add github:rogerpence/rp-utils#v1.0.13` 

is your **one-command solution** for upgrading to any version! 🎯
- Fetch v1.0.13 from GitHub
- Update [`package.json`](vscode-file://vscode-app/c:/Users/thumb/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) to reference v1.0.13
- Update [`pnpm-lock.yaml`](vscode-file://vscode-app/c:/Users/thumb/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-browser/workbench/workbench.html)
- Replace the files in [`node_modules`](vscode-file://vscode-app/c:/Users/thumb/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-browser/workbench/workbench.html)

Declare rp-utils like this and be sure to update version number before doing pnpm update

```
    "dependencies": {
        "@rogerpence/rp-utils": "github:rogerpence/rp-utils#v1.0.12",
```

This code creates a local NPM package:

## `package.json`

```json
{
    "name": "@rogerpence/rp-utils",
    "version": "1.0.12",
    "type": "module",
    "main": "./src/index.js",
    "exports": {
        ".": "./src/index.ts",
        "./console": "./src/console.ts",
        "./date": "./src/date.ts",
        "./filesystem": "./src/filesystem.ts",
        "./markdown": "./src/markdown.ts",
        "./string": "./src/string.ts"
    },
    "files": [
        "src"
    ],
    "dependencies": {
        "@types/js-yaml": "^4.0.9",
        "@types/node": "^22.19.1",
        "ansis": "^4.2.0",
        "js-yaml": "^4.1.1"
    }
}
```

## `tsconfig.json`

```
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,    
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

## Example TS file

`string.ts`

```
export const roger = "pence";
```


## Barrel export 

This is optional, but it allows easy importing of any export the package offers (regardless of which file it's in)

For example, with the barrel export provided:

```
import { getAllDirEntries, parseMarkdownFile } from '@rogerpence/rp-utils';
```

instead of 

```
import { getAllDirEntries } from '@rogerpence/rp-utils/filesystem';
import { parseMarkdownFile } from '@rogerpence/rp-utils/markdown';
```

`index.ts`

```
// This is known as the barrel export pattern.
export * from "./console";
export * from "./date";
export * from "./filesystem";
export * from "./markdown";
export * from "./string";
```



```
git tag v1.0.12 git push && git push --tags
```









Here's how to create a standalone utils package and reference it from your SvelteKit project:

## **Step 1: Create standalone utils package**

````bash
cd c:\Users\thumb\Documents\projects\svelte
mkdir utils
cd utils

pnpm init
````

## **Step 2: Set up the utils package structure**

````
utils/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── filesystem.ts
    ├── console.ts
    └── date.ts
````

## **Step 3: Create package.json**

````json
{
  "name": "@yourteam/utils",
  "version": "1.0.0",
  "type": "module",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./filesystem": "./src/filesystem.ts",
    "./console": "./src/console.ts",
    "./date": "./src/date.ts"
  },
  "files": [
    "src"
  ],
  "dependencies": {
    "@types/node": "^22"
  }
}
````

## **Step 4: Create utils/tsconfig.json**

````json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
````

## **Step 5: Move your utility files**

````typescript
import { fileURLToPath } from 'url';
import path from 'path';

export function getRelativePath() {
	const fullFilePath = fileURLToPath(import.meta.url);
	return path.dirname(fullFilePath);
}

export function truncatePathAfterDirectory(fullPath: string, lastDirectory: string): string {
	const parts = fullPath.split(path.sep);
	const srcIndex = parts.indexOf(lastDirectory);
	if (srcIndex === -1) {
		console.error(`Path doesn't contain the '${lastDirectory}' directory`);
		process.exit(1);
	}
	return parts.slice(0, srcIndex + 1).join(path.sep);
}

export function getPathForCli(...segments: string[]): string {
	const srcPath = truncatePathAfterDirectory(process.cwd(), 'src');
	if (segments.length == 1) {
		segments = ['lib', 'data', ...segments];
	}
	return path.join(srcPath, ...segments);
}
````


`index.ts` contents

````typescript
export * from './filesystem.js';
export * from './console.js';
export * from './date.js';
````

## **Step 6: Initialize git in utils (optional but recommended)**

````bash
cd c:\Users\thumb\Documents\projects\svelte\utils
git init
git add .
git commit -m "Initial utils package"
````

## **Step 7: Link utils to your mdsvex project**

### **Option A: Using pnpm link (simplest for local development)**

````bash
# In the utils directory
cd c:\Users\thumb\Documents\projects\svelte\utils
pnpm link --global

# In your mdsvex project
cd c:\Users\thumb\Documents\projects\svelte\mdsvex
pnpm link --global @yourteam/utils
````

### **Option B: Using file: protocol (better for team)**

Update your mdsvex package.json:

````json
{
	"name": "mdsvex",
	"private": true,
	"version": "0.0.1",
	"type": "module",
	"scripts": {
		"dev": "vite dev",
		"build": "vite build",
		"preview": "vite preview",
		"prepare": "svelte-kit sync || echo ''",
		"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
		"format": "prettier --write .",
		"lint": "prettier --check . && eslint ."
	},
	"devDependencies": {
		"@eslint/compat": "^1.4.0",
		"@eslint/js": "^9.38.0",
		"@sveltejs/adapter-auto": "^7.0.0",
		"@sveltejs/kit": "^2.47.1",
		"@sveltejs/vite-plugin-svelte": "^6.2.1",
		"@types/js-yaml": "^4.0.9",
		"@types/node": "^22",
		"ansis": "^4.2.0",
		"eslint": "^9.38.0",
		"eslint-config-prettier": "^10.1.8",
		"eslint-plugin-svelte": "^3.12.4",
		"globals": "^16.4.0",
		"js-yaml": "^4.1.0",
		"prettier": "^3.6.2",
		"prettier-plugin-svelte": "^3.4.0",
		"svelte": "^5.41.0",
		"svelte-check": "^4.3.3",
		"typescript": "^5.9.3",
		"typescript-eslint": "^8.46.1",
		"vite": "^7.1.10"
	},
	"pnpm": {
		"onlyBuiltDependencies": [
			"esbuild"
		]
	},
	"dependencies": {
		"@yourteam/utils": "file:../utils",
		"zod": "^4.1.12"
	}
}
````

Then run:
````bash
cd c:\Users\thumb\Documents\projects\svelte\mdsvex
pnpm install
````

### **Option C: Using git repository (best for team sharing)**

````bash
# Push utils to a git repository first
cd c:\Users\thumb\Documents\projects\svelte\utils
git remote add origin https://github.com/yourteam/utils.git
git push -u origin main
````

Then in your mdsvex package.json:

````json
{
  "dependencies": {
    "@yourteam/utils": "github:yourteam/utils#main",
    "zod": "^4.1.12"
  }
}
````

## **Step 8: Update TypeScript config in mdsvex**

````json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler",
    "paths": {
      "$lib": ["./src/lib"],
      "$lib/*": ["./src/lib/*"],
      "@yourteam/utils": ["../utils/src/index.ts"],
      "@yourteam/utils/*": ["../utils/src/*"]
    }
  }
}
````

## **Step 9: Use in your mdsvex project**

````typescript
import { getPathForCli, truncatePathAfterDirectory } from '@yourteam/utils/filesystem';

// ...existing code...

const dataPath = getPathForCli('index.json');
console.log(dataPath);
````

## **Recommendation: Use Option B (file: protocol)**

**Advantages:**
- ✅ Works for whole team (relative path)
- ✅ Changes in utils immediately available
- ✅ No global state like pnpm link
- ✅ Works in CI/CD
- ✅ Simple to set up

**Your file structure:**
````
svelte/
├── utils/              # Standalone package
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
└── mdsvex/            # Your SvelteKit app
    ├── package.json   # References: "file:../utils"
    └── src/
````

This approach keeps utils completely separate while making it easy to share across multiple projects!

Similar code found with 3 license types

## Installing packages from GitHub that need a build step

### Setting up `package.json`

To install your package directly from GitHub using `pnpm add github:rogerpence/sv-pkg`, you need to ensure it builds automatically when installed. Here are the changes needed: 

Your package will automatically build when installed from GitHub. The key change is the `prepare` script, which runs automatically after `pnpm install`.

**How to use it:**

1. **Push your code to GitHub** at `github.com/rogerpence/sv-pkg`

2. **In another project, install it:**
   ```bash
   pnpm add github:rogerpence/sv-pkg
   ```

   Or with a specific branch/tag:
   ```bash
   pnpm add github:rogerpence/sv-pkg#main
   pnpm add github:rogerpence/sv-pkg#v1.0.0
   ```

3. **Use it in your project:**
   ```svelte
   <script>
     import { HelloWorld } from 'sv-pkg';
   </script>

   <HelloWorld />
   ```

**What changed:**
- The `prepare` script now runs `svelte-package`, so the package builds automatically when installed from GitHub
- Added a separate `package` script for manual builds with publint
- The `prepack` script runs before publishing to npm (if you do that later)

The package will build the dist folder automatically when someone runs `pnpm add github:rogerpence/sv-pkg`.

### What is this type of packaging called

This type of packing use  [[github-packages]] as an alternative to npmjs.com (the NPM repository).

It may also be **"Git dependencies"** or **"installing packages from Git"**. It's a standard npm/pnpm/yarn feature that lets you use Git repositories (GitHub, GitLab, Bitbucket, etc.) as package sources instead of the npm registry.

**Common terms for this:**
- Git dependencies
- Git-based packages
- Direct Git installation
- GitHub packages (informal)

**Syntax variations:**
```bash
# GitHub shorthand
pnpm add github:rogerpence/sv-pkg

# Full Git URL
pnpm add git+https://github.com/rogerpence/sv-pkg.git

# Specific branch/tag/commit
pnpm add github:rogerpence/sv-pkg#main
pnpm add github:rogerpence/sv-pkg#v1.0.0
pnpm add github:rogerpence/sv-pkg#abc1234
```

**Benefits:**
- ✅ No need to publish to npm registry
- ✅ Works with private repos (if you have access)
- ✅ Can install specific branches/commits
- ✅ Keeps packages internal to your organization

**Important:** The `prepare` script is what makes this work - it builds the package after installation since Git repos don't include the built dist folder (which is typically gitignored).

Your setup is perfect for distributing reusable Svelte component libraries without publishing to npm!

### The `prepare` script is key

The `prepare` script is an **npm lifecycle script** that's automatically called by npm/pnpm/yarn in these situations:

**1. When someone installs your package from Git:**
```bash
pnpm add github:rogerpence/sv-pkg
```
Process flow:
- pnpm clones the repo
- Runs `pnpm install` (installs your devDependencies)
- **Automatically runs `prepare` script** ← builds your dist folder
- Package is ready to use

**2. During local development:**
```bash
pnpm install  # in your package directory
```
The `prepare` script runs after installing dependencies.

**3. Before publishing to npm:**
```bash
npm publish
```
Runs `prepare` before publishing (though you're not using this).

**Other lifecycle scripts for reference:**
- `prepublishOnly` - Only runs before `npm publish`
- `prepack` - Runs before creating a tarball
- `postinstall` - Runs after package is installed (in the consuming project)

So for Git dependencies, **pnpm** (or npm/yarn) automatically calls the `prepare` script after cloning and installing dependencies. This is why your package builds automatically when installed from GitHub!

### Do GitHub packages run in serverless environments like Vercel

Yes, they work on Vercel and other serverless platforms, but with some important considerations:

**✅ What works:**
- Vercel, Netlify, Cloudflare Pages all support Git dependencies
- The `prepare` script runs during the build phase
- Your package gets built automatically before deploying

**⚠️ Important considerations:**

**1. Build time increases:**
- Your package builds during every deployment
- The consuming project must install your devDependencies (@sveltejs/package, etc.)

**2. Installation mode:**
Most platforms install dependencies differently:
```bash
# Development (runs prepare) - used by Vercel
pnpm install

# Production only (might skip prepare on some platforms)
pnpm install --prod
```

**3. Best practices for Vercel:**
Your current setup should work, but consider:

- Keep your `prepare` script fast
- Ensure devDependencies are reasonable in size
- Consider caching strategies

**Alternative for production:**
If builds become problematic, you could:
1. Create GitHub releases with pre-built dist folder
2. Install from release tags: `pnpm add github:rogerpence/sv-pkg#v1.0.0`
3. Include dist in that specific release (using `.npmignore` instead of .gitignore)

Your current setup will work fine on Vercel - the platform handles Git dependencies well during builds.


### simplified workflow

Implicitly including '/dist' (in .gitignore)

**Simplified workflow:**
```bash
# Make changes to your components
# Build
pnpm run package

# Commit everything (including dist)
git add .
git commit -m "feat: update HelloWorld component"
git push

# Create release when ready
git tag v0.0.5
git push origin v0.0.5
```

Then in your consuming projects:
```bash
pnpm add github:rogerpence/sv-pkg#v0.0.5
```

Since it's your own project and not a public library, you don't need to follow public npm package conventions. This approach is cleaner and more reliable for your needs!>)



You're missing one critical step! Here's the complete workflow:

**1. Create SvelteKit library & develop**
- Add components to components
- Export them in index.ts
- Test in routes (not included in package) ✅

**2. Build the package**
```bash
pnpm run package
```
This creates the dist folder with compiled components ← **Don't skip this!**

**3. Commit and push with tag**
```bash
git add .
git commit -m "feat: add new components"
git push

git tag v0.0.6
git push origin v0.0.6
```

**4. Install in consuming project**
```bash
pnpm add github:rogerpence/sv-pkg#v0.0.6
```

**The key:** Always run `pnpm run package` before committing changes that you want in a release. The dist folder is what actually gets imported by consuming projects.

That's it! You've got it now.

> With this simplified workflow, (except for the 'package' script) there isn't anything specific in package.json 'scripts' that is doing anything to make this work,

For the GitHub package workflow, **only `package` is essential**:

**Required:**
- `package` - Builds the dist folder

**Optional (for local development only):**
- `dev` - Run development server to test routes
- `build` - Not needed for the package workflow
- `preview` - Preview the dev server
- `check`, `format`, `lint` - Code quality tools
- `release` - Redundant, you can just run `package` directly

The important parts for making this work are actually in the **package.json metadata**, not the scripts:

```json
"files": ["dist", ...],          // What gets included
"svelte": "./dist/index.js",     // Entry point
"types": "./dist/index.d.ts",    // TypeScript types
"exports": { "." : { ... } }     // Module exports
```

Those fields tell consuming projects where to find your compiled components!

### Further reading

Great question! Here are the best resources:

**Official Documentation:**
- **npm docs on Git dependencies**: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#git-urls-as-dependencies
  - The canonical reference for Git-based installs
  
- **pnpm docs**: https://pnpm.io/cli/add#install-from-git-repository
  - pnpm-specific Git install options

- **SvelteKit packaging guide**: https://kit.svelte.dev/docs/packaging
  - How `svelte-package` works

**Key Topics to Search:**
- "npm git dependencies"
- "installing packages from github"
- "git+https dependencies"
- "npm package.json files field"
- "npm lifecycle scripts" (prepare, prepack, etc.)

**Useful Tools:**
- **publint** (you're already using it!) - Validates package exports
- **arethetypeswrong** - Checks TypeScript exports: https://arethetypeswrong.github.io/

**Advanced:**
- **Git submodules vs npm git dependencies** - Different approaches to sharing code
- **Monorepos with pnpm workspaces** - If you have multiple related packages

The npm docs on Git URLs are really the definitive guide - everything else builds on those concepts. Your setup is solid now, so you've got a great foundation!

### Detail on publint

**publint** validates your package.json configuration to catch common packaging mistakes.

It checks:
- ✅ `exports` field is correct
- ✅ `files` field includes necessary files
- ✅ Entry points (main, svelte, types) exist
- ✅ Dual package hazards (ESM/CJS issues)
- ✅ Missing files that should be published
- ✅ TypeScript types are accessible

**Example issues it catches:**
- "You're exporting index.js but it doesn't exist"
- "Your types field points to a file not in the files array"
- "You have CJS and ESM conflicts"

**In your workflow:**
```json
"package": "svelte-kit sync && svelte-package && publint"
```

After `svelte-package` builds the dist folder, `publint` checks that everything is configured correctly. If there's an issue, it warns you **before** you commit and push.

**Try it:**
```bash
pnpm run package
```

If publint finds issues, it'll output warnings/errors. If it's silent, your package is properly configured!

You can also check it online: https://publint.dev/

It's basically a **pre-flight check** to ensure your package will work correctly when installed.