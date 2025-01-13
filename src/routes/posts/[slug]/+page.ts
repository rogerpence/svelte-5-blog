import { error } from '@sveltejs/kit';

interface RouteParams {
	slug: string;
}

export const load = async ({ url, route, params }: { url: URL; route: { id: string }; params: RouteParams }) => {
    console.log(route.id)
	console.log(params.slug)

	try {
		const post = await import(`../../../markdown/posts/${params.slug}.md`);
		if (!post) {
			throw error(404, 'Post not found');
		}

		return {
			content: post.default,
			meta: post.metadata
		};
	} 
	catch (error) {
			console.log(error)
	}
}		

