---
title: Sveltekit forms - request.FormData1
description: Sveltekit forms - request.FormData1
date_created: 2025-05-18T00:00:00.000Z
date_updated: 2025-12-18
date_published:
pinned: false
tags:
  - svelte
  - forms
---
Form data is sent to a target action through the `event` argument:

```
export const actions: Actions = {
    create: async (event) => {
        const formData = Object.fromEntries(await event.request.formData());

```

The [formData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object is essentially a set of values for each form input received:

![[image-2.png|362x424]]
This line

```
const formData = Object.fromEntries(await event.request.formData());
```

is the canonical way to convert the form data into a JavaScript object. [Object.fromEntries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries) transforms a list of key-value pairs into an object.