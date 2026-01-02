---
title: Trimming a form value in Sveltekit
description: Trimming a form value in Sveltekit
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
This is especially necessary for `input type="email"` inputs. A trailing blank makes the intrinsic email validation fail. This code protects a user against that errant white space.

```
const trimValue = (e) => {
	e.target.value = e.target.value.trim();
};
```

```
<input type="email" name="email" id="email"	on:blur={trimValue}/>
```