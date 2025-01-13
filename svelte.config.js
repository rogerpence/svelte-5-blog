import { mdsvex } from "mdsvex";
import adapter from '@sveltejs/adapter-auto';
//import adapter from '@sveltejs/adapter-vercel';

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
// import {  bundledLanguages, createHighlighter } from 'shiki'
// import { escapeSvelte } from "mdsvex";

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
    smartypants: true,
    remarkPlugins: [],
    rehypePlugins: [],
    // highlight: {
	// 	highlighter: async (code, lang = 'text') => {
	// 		const highlighter = await createHighlighter({
	// 			themes: ['poimandres'],
    //             langs: Object.keys(bundledLanguages),
	// 		})
	// 		await highlighter.loadLanguage('javascript', 'typescript')
	// 		const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme: 'poimandres' }))
	// 		return `{@html \`${html}\` }`
	// 	}
	// },        
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    extensions: [".svelte", ".md"],


    preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],

    kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	},
  
};

export default config;


