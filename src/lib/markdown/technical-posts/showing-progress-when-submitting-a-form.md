---
title: Showing progress on form submission
description: Showing progress on form submission
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - asna-svelte
  - sveltekit
---
There are probably more compelling ways to show that something is happening when a form has been submitted, but this quick and dirty way to provide the user with some feedback works pretty well.

Add the following `on:submit` even handler to the form.

```
<form method="POST" action="/actions/?/sendEmail" on:submit={onFormSubmission}>

...

<button id="form-button" class="btn btn-ok" type="submit">Send email</button>

...

</form>
```

Put this function in the component's `<script>` area. Make sure the `querySelector` method uses the correct button ID.

```
const onFormSubmission = (e) => {
	const btn = document.querySelector('#form-button');
	btn.innerText = 'Preparing email...';
	btn.style = 'cursor:wait';
	e.currentTarget.style = 'cursor:wait';
};
```

This lets JavaScript do a little work to show something is happening when the button is clicked and before the form is submitted to the server.