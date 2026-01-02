---
title: Chrome com.chrome.devtools.json file error
description: Chrome com.chrome.devtools.json file error
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - chrome
---
While working on the asna.com Sveltekit upgrade, I started encountering this error with Chrome:

![[image-15.png]]

It was flooding my terminal with messaging. I stopped it by manually adding an empty for the file it was looking for.

![[image-16.png]]

Vite needed this `server/fs/allow` setting to serve that file:

vite.config.ts

```
export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
			allow: ['.well-known/appspecific/']
		}
	}
});
```