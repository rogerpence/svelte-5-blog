import { query } from '$app/server';

import { type MarkdownDocument } from '$lib/types/rpUtilTypes';

import type { TechnicalNoteFrontmatter } from '$lib/types/app-types';

import markdownObjectsData from '$lib/data/tech-markdown-objects.json';

export const getPosts = query(async () => {
	const data = markdownObjectsData as MarkdownDocument<TechnicalNoteFrontmatter>[];
	return data;
});
