import FlexSearch, { type Index } from 'flexsearch';

let contentsIndex: FlexSearch.Index;

let contents: Content[];

export function searchIndex(resultLocale: string, searchTerm: string) {
	if (searchTerm.trim().length === 0) {
		return;
	}
	const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const results = contentsIndex.search(match, { limit: 50 });

	if (searchTerm.length > 0 && results.length === 0) {
		return [
			{
				title: 'No results found.',
				content: ['Please try a different search term.'],
				slug: ''
			}
		];
	}

	const searchResults = results
		.map((index) => contents[index as number])
		.filter((content) => content.locale === resultLocale)
		.map(({ slug, title, description, content, tags_list, isPage }) => {
			const tagHTMLString = convertTagsListToHTMLString(tags_list);

			const barPosition = title.indexOf('|');
			if (barPosition !== -1) {
				title = title.substring(0, barPosition);
			}

			return {
				slug,
				title: `${replaceTextWithMarker(title, match)}`,
				description: `${replaceTextWithMarker(description, match)}`,
				content: '',
				tags: `<span class="search-results-tags-wrapper">${tagHTMLString}</span>`,
				isPage
			};
		});

	//console.log("searchResults", searchResults);

	// Ensure only unique 'slug' entries are returned.
	return dedupeByPropertyMap(searchResults, 'slug');
}
