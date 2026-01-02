// import 'rp-utils/console';
import { query } from '$app/server';
import { z } from 'zod';

import navigationObjectsData from '$lib/data/brainiac-nav-objects.json';

import { getPagedData, sortObjArray, type PagerObj } from 'rp-utils';
import { type TechnicalNoteFrontmatter } from '$lib/types/app-types';
import { TECHNICAL_POSTS_GRID_ROWS } from '../../globals';

const getTechPostsPageSchema = z.object({
	pageNumber: z.number().int().positive()
});

export const getTechPostsPage = query(
	getTechPostsPageSchema,
	async (input): Promise<PagerObj<TechnicalNoteFrontmatter>> => {
		const { pageNumber } = input;

		const pageSize = 16;

		const sortedData = sortObjArray(navigationObjectsData, ['title'], ['asc']);
		//const filteredData = sortedData.filter((post) => post['tags'].includes('css'));

		return getPagedData<TechnicalNoteFrontmatter>(sortedData, pageSize, pageNumber);
	}
);
