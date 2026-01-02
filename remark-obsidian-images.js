import { visit } from 'unist-util-visit';

function joinUrl(baseUrl, file) {
	const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
	return (
		base +
		file
			.trim()
			.split('/')
			.map((seg) => encodeURIComponent(seg))
			.join('/')
	);
}

function altFromFilename(file) {
	const name = file.trim().split('/').pop() ?? file.trim();
	return name.replace(/\.[a-z0-9]+$/i, '');
}

function parseObsidianInner(inner) {
	// inner examples:
	//   image-32.png
	//   image-32.png|700
	const [fileRaw, pipeRaw] = String(inner).split('|', 2);
	const file = (fileRaw ?? '').trim();
	const pipe = (pipeRaw ?? '').trim();

	const width = pipe && /^\d+$/.test(pipe) ? Number(pipe) : undefined;
	return { file, width };
}

function looksLikeImageFilename(s) {
	return /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(String(s));
}

function getReferenceIdentifier(node) {
	// remark reference nodes typically have: identifier + label
	return (node?.identifier ?? node?.label ?? '').toString();
}

/**
 * @param {{ baseUrl: string, alt?: 'filename'|'empty'|((file:string)=>string) }} options
 */
export default function remarkObsidianImages(options = {}) {
	const { baseUrl, alt = 'filename' } = options;
	if (!baseUrl) throw new Error('remarkObsidianImages: "baseUrl" is required');

	const getAlt =
		typeof alt === 'function' ? alt : alt === 'empty' ? () => '' : (file) => altFromFilename(file);

	return (tree, file) => {
		// This logs to the dev-server terminal (Node), not the browser console.
		console.log('[remark-obsidian-images] processing:', file?.filename);

		visit(tree, 'paragraph', (p) => {
			const kids = p.children ?? [];
			if (kids.length < 3) return;

			// Find patterns: text("![") + (linkReference|imageReference) + text("]")
			for (let i = 0; i <= kids.length - 3; i++) {
				const a = kids[i];
				const b = kids[i + 1];
				const c = kids[i + 2];

				if (a?.type !== 'text' || c?.type !== 'text') continue;

				// be tolerant of whitespace
				if (String(a.value).trim() !== '![') continue;
				if (String(c.value).trim() !== ']') continue;

				if (b?.type !== 'linkReference' && b?.type !== 'imageReference') continue;

				const inner = getReferenceIdentifier(b).trim();
				if (!inner) continue;

				const { file: imgFile, width } = parseObsidianInner(inner);

				// Avoid converting normal markdown references that aren't filenames
				if (!imgFile || !looksLikeImageFilename(imgFile)) continue;

				const imageNode = {
					type: 'image',
					url: joinUrl(baseUrl, imgFile),
					alt: getAlt(imgFile),
					title: null,
					data: width ? { hProperties: { width: String(width) } } : {}
				};

				// Replace the 3 nodes with a single image node
				kids.splice(i, 3, imageNode);

				// Continue scanning after the inserted node
			}

			p.children = kids;
		});
	};
}
