import { tags } from '$lib/data/tag-map';

export function GET() {
	const tags_en = tags['en'];
	return new Response(JSON.stringify(tags, null, 4), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		}
	});
}