import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';

import remarkObsidianImages from './remark-obsidian-images.js';

const shiki = await createHighlighter({
	themes: ['one-dark-pro', 'night-owl', 'solarized-dark', 'dracula'],
	langs: ['csharp', 'text', 'bash', 'json', 'js', 'ts', 'html', 'css', 'md', 'sql', 'powershell']
});

function escapeForSvelteTemplateLiteral(html) {
	return html
		.replace(/\\/g, '&#92;') // prevents `\U` etc. from breaking the surrounding template literal
		.replace(/`/g, '&#96;') // prevents ending the surrounding `...`
		.replace(/\$\{/g, '&#36;{'); // prevents `${...}` interpolation
}

function escapeForHtmlCode(code) {
	return (
		code
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')
			// Critical for Windows paths inside mdsvex-generated template literals:
			.replace(/\\/g, '&#92;')
			// Prevent breaking out of the surrounding `...` template literal:
			.replace(/`/g, '&#96;')
			// Prevent `${...}` interpolation if it ends up inside a template literal:
			.replace(/\$\{/g, '&#36;{')
	);
}

function stripNonnegativeTabindexFromShikiPre(html) {
	// Shiki often emits: <pre class="shiki" tabindex="0">...</pre>
	// Svelte a11y warns about non-interactive elements having tabindex>=0.
	// Remove tabindex from <pre ...> only.
	return html.replace(/<pre\b([^>]*?)\s+tabindex=(?:"\d+"|'\d+'|\d+)([^>]*)>/gi, '<pre$1$2>');
}

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	// remarkPlugins: [
	// 	[
	// 		remarkObsidianImages,
	// 		{
	// 			baseUrl: 'https://asna-assets.nyc3.digitaloceanspaces.com/brainiac/',
	// 			alt: 'filename' // or: 'empty'
	// 		}
	// 	]
	// ],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const language = lang && shiki.getLoadedLanguages().includes(lang) ? lang : 'text';
			let html = shiki.codeToHtml(code, {
				lang: language,
				theme: 'dracula',
				padding: '2rem'
			});

			html = stripNonnegativeTabindexFromShikiPre(html);

			return escapeSvelte(html);
		}
	}
	// dhighlight: {
	// 	highlighter: (code, lang) => {
	// 		const language = lang || 'text';
	// 		return `<pre class="language-${language}"><code class="language-${language}">${escapeForHtmlCode(
	// 			code
	// 		)}</code></pre>`;
	// 	}
	// }
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	// preprocess: vitePreprocess(),

	extensions: ['.svelte', '.md'],
	preprocess: [mdsvex(mdsvexOptions), vitePreprocess()],

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		experimental: {
			remoteFunctions: true
		},
		alias: {}
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

export default config;
