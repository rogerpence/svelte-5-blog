---
title: Submit extra data with Superform
description: Submit extra data with Superform
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
In the `ContactForm.svelte` component I tried to submit extra data to the server with this [SuperForms FAQ](https://superforms.rocks/faq#what-about-the-other-way-around-posting-additional-data-to-the-server) but it didn't work.

```
export let questions =[]

...

onMount(() => {
	allQuestions = questions.join(';');
});

...

const { form, errors } = superForm(data.form, {
	onSubmit({ formData }) {
		console.log(questions);
		formData.set('questions', allQuestions);
	}
});
```

```
export const actions = {
	create: async (event) => {
		const formData = await event.request.formData();
		const form = await superValidate(event, contactFormSchema);
		console.log(form.data);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		if (formData.has('questions')) {
			console.log(formData.questions);
		}
		...
```

The `questions` data (and the `questions` key in formData) didn't make it to the server.

I resolved the issue for now by adding a hidden field to the form.