import { type TechnicalNoteFrontmatter } from '$lib/types/app-types';
//import { type IndexObject } from 'rp-utils';
import { type IndexObject } from '$lib/types/rpUtilTypes';

import FlexSearch, { type Index } from 'flexsearch';

// All indexed markdown files or HTML content objects must have this shape.
// This is is the input object to FlexSearch and also the (direct) output of the
// searchIndex method below.

// Note that the 'content' property is always an empty string in the search result. The
// search result doesn't need the 'content' property and truncating its value
// minimizes the memory impact of FlexSearch.
export type SearchObject = {
	slug: string;
	title: string;
	description: string;
	content: string;
	tags: string[];
};

let flexSearchIndex = new FlexSearch.Index({ tokenize: 'forward' });
let flexSearchContents: SearchObject[] = [];

/**
 * Escape regex-special characters in searchTerm by prefixing them with a backslash.
 * @param input
 * @returns
 */
function escapeRegexCharacters(input: string): string {
	return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function createIndex(sourceData: IndexObject<SearchObject>[]) {
	//let flexSearchIndex = new FlexSearch.Index({ tokenize: 'forward' });

	sourceData.forEach((post, i) => {
		const item = `${post.title} ${post.content} ${post.description} ${post.tags.join(' ')} ${post.slug}`;
		flexSearchIndex.add(i, item);
	});

	flexSearchContents = sourceData.map(({ slug, title, description, content, tags }) => ({
		slug,
		title,
		description,
		content,
		tags
	}));
}

export function searchIndex(resultLocale: string, searchTerm: string): SearchObject[] | null {
	if (searchTerm.trim().length === 0) {
		return null;
	}
	const match = escapeRegexCharacters(searchTerm);
	const results = flexSearchIndex.search(match, { limit: 50 });

	if (searchTerm.length > 0 && results.length === 0) {
		return [
			{
				slug: '',
				title: 'No results found.',
				description: 'no results',
				content: 'Please try a different search term.',
				tags: []
			}
		];
	}

	const searchResults = results
		.map((index) => flexSearchContents[index as number])
		//        .filter((content) => content.locale === resultLocale)
		.map(({ slug, title, description, content, tags }) => {
			const tagHTMLString = tags.join(' ');

			const barPosition = title.indexOf('|');
			if (barPosition !== -1) {
				title = title.substring(0, barPosition);
			}

			return {
				slug,
				title: title,
				description: description,
				content: '', // content isn't needed in the search results. At least yet!
				tags: tags
			};
		});

	//console.log("searchResults", searchResults);

	// Ensure only unique 'slug' entries are returned.
	//return dedupeByPropertyMap(searchResults, 'slug');
	return searchResults;
}
