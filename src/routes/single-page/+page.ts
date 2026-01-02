import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getSingleTechPost } from '$lib/remote-funcs/__get-single-test-post.remote';
import type { TechnicalNoteFrontmatter } from '$lib/types/app-types';
import type { Component } from 'svelte';

// ...existing code...

// Grab all md files under technical-posts (supports subfolders too)
const mdModules = import.meta.glob('../../lib/markdown/technical-posts/**/*.md');

export const load: PageLoad = async ({ url }) => {
	const indexParam = url.searchParams.get('index') ?? '0';
	const indexNumber = Number(indexParam);

	if (!Number.isInteger(indexNumber) || indexNumber < 0) {
		throw error(400, `Invalid index: ${indexParam}`);
	}

	const post = await getSingleTechPost({ indexNumber });

	// If post.slug might include "technical-posts/...", normalize it to be relative to that folder
	const normalizedSlug = post.slug.replace(/^technical-posts\//, '');

	const key = `../../lib/markdown/technical-posts/${normalizedSlug}.md`;

	const importer = mdModules[key];

	if (!importer) {
		throw error(404, `Markdown file not found for slug: ${normalizedSlug}`);
	}

	const fullPost = (await importer()) as {
		default: Component;
		metadata: TechnicalNoteFrontmatter;
	};

	return {
		post,
		content: fullPost.default,
		meta: fullPost.metadata,
		title: fullPost.metadata.title,
		module: mdModules
	};
};
