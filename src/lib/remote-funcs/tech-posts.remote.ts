import { query } from '$app/server';

import { type MarkdownDocument } from '$lib/types/rpUtilTypes';

import { TechnicalNoteFrontmatterSchema } from '$lib/types/app-types';

import type { TechnicalNoteFrontmatter } from '$lib/types/app-types';

import markdownObjectsData from '$lib/data/brainiac-markdown-objects.json';

export const getPosts = query(async () => {
	const data = markdownObjectsData as MarkdownDocument<TechnicalNoteFrontmatter>[];
	return data;
});

// export const getPosts = query(async (): Promise<MarkdownPosts<TechnicalNoteFrontmatter>[]> => {
// 	const data = markdownObjectsData as MarkdownPosts<TechnicalNoteFrontmatter>[];
// 	return data;
// });
