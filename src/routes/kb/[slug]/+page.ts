import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Component } from 'svelte';
import type { TechnicalNoteFrontmatter } from '$lib/types/app-types';

// The issue is that mdsvex components are Svelte components (functions) which aren't
// serializable to send from the server to the client. You need to use a universal load function (+page.ts) instead of +page.server.ts:

export const load: PageLoad = async ({ params, url }) => {
	const slug = params.slug;
	const folder = url.pathname.split('/')[1];

	try {
		const post = (await import(`../../../lib/markdown/${folder}/${slug}.en.md`)) as {
			default: Component;
			metadata: TechnicalNoteFrontmatter;
		};

		return {
			content: post.default, // non-serializable; fine for universal load usage
			meta: post.metadata,
			title: post.metadata.title
		};
	} catch {
		throw error(404, `Could not find post: ${slug}`);
	}
};
