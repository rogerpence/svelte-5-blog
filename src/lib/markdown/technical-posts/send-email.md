---
title: Send an email from Sveltekit
description: Send an email from Sveltekit
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
```
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { formatDate } from '$lib/utility';
import { sendEmail } from '$lib/sendemail.js';
import { redirect } from '@sveltejs/kit';
export const prerender = false;

import RequestProductDownloadSchema from './RequestProductDownloadSchema.js';

let parentUrl

export const load = async (event) => {
	parentUrl = event.route.id
	const form = await superValidate(event, RequestProductDownloadSchema);

	return {
		form
	};
};

const getEmailBody = (form, url) => {
	const subscribe = form.answer2 ? 'yes ' : 'no';

	return `
${form.data.first_name},

Your ASNA download link for ${form.data.product} is below.`
};

export const actions = {
	sendEmail: async (event) => {
		const form = await superValidate(event, RequestProductDownloadSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const messageTemplate = getEmailBody(form, url);
		const email = form.data.email;
		const subject = form.data.subject;
		const message = messageTemplate.trim();
		const country = form.data.country;

		try {
			await sendEmail(email, subject, message);
		} catch (except) {
			console.log(JSON.stringify(except));
			const errorData = {
				errorDetail: except.response,
				user: EMAIL_USER,
				password: EMAIL_PASSWORD,
				from: EMAIL_FROM
			};
			logError(errorData);
			const errorMessage = except.response.replaceAll(';', '<br>');
			throw error(412, errorMessage);
		}

		throw redirect(
			303,
			parentUrl
		);
	}
};
```