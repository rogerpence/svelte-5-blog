---
title: Getting locale from Sveltekit URL
description: Getting locale from Sveltekit URL
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
  - javascript
---
Note how you can use destructuring's default value to force a value for an undefined argument.

[[sveltekit-get-page-locale]]
[[Get locale-specific details]]

```js
<script>
    import {page} from'$app/stores' const {(lang = "en")} from $page.params
</script>
```