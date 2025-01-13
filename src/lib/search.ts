import {json} from '@sveltejs/kit'
import posts from '$lib/data/index-map.ts'

export async function get() {
    return json(posts);
}