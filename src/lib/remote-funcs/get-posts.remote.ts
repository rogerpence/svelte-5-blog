// import 'rp-utils/console';
import { query } from '$app/server';
import { z } from 'zod';

//import navigationObjectsData from '$lib/data/brainiac-nav-objects.json';

import { getPagedData, sortObjArray, type PagerObj, type NavigationObject } from 'rp-utils';
import { type TechnicalNoteFrontmatter } from '$lib/types/app-types';
import { TECHNICAL_POSTS_GRID_ROWS } from '../../globals';

async function getPosts(postIdentifier: string) {
	const result = await import(`$lib/data/kb-nav-objects.json`);
	// console.log('result', result.default);

	return result.default; // <-- return the array, not the wrapper object
}

const getTechPostsPageSchema = z.object({
	pageNumber: z.number().int().positive()
});

export const getPostsPage = query(
	getTechPostsPageSchema,
	async (input): Promise<PagerObj<TechnicalNoteFrontmatter>> => {
		const { pageNumber } = input;

		const pageSize = 16;

		const posts = (await getPosts('kb')) as NavigationObject<TechnicalNoteFrontmatter>[];
		// console.log(posts);

		const sortedData = sortObjArray(posts, ['title'], ['asc']);
		//const filteredData = sortedData.filter((post) => post['tags'].includes('css'));

		return getPagedData<TechnicalNoteFrontmatter>(sortedData, pageSize, pageNumber);
	}
);
