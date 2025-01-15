// const cssnano = require('cssnano');
// const postcssImport = require('postcss-import');
// const postcssCustomMedia = require('postcss-custom-media');
// const openProps = require('open-props');
// const postcssJitProps = require('postcss-jit-props');
// const postcssGlobalData = require('@csstools/postcss-global-data');
// const purgecss = require('@fullhuman/postcss-purgecss');


// change file extension to .mjs
// change 
import cssnano from 'cssnano';
import postcssImport from 'postcss-import';
import postcssCustomMedia from 'postcss-custom-media';
import openProps from 'open-props';
import postcssJitProps from 'postcss-jit-props';
import postcssGlobalData from '@csstools/postcss-global-data';
// change
import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';

const DO_NOT_PRESERVE_UNRESOLVED_RULE = false;

console.log('NODE_ENV', process.env.NODE_ENV);

// change
//module.exports = {
export default {
	plugins: [
		postcssImport(),
		postcssJitProps(openProps),
		postcssGlobalData({
		 	files: ['./node_modules/open-props/src/props.media.css']
		}),
		postcssCustomMedia({
			preserve: DO_NOT_PRESERVE_UNRESOLVED_RULE
		}),

		// ...(process.env.NODE_ENV === 'production'
		// 	? [purgeCSSPlugin(
		// 		{ 
		// 			content: ['./src/routes/**/*.svelte'],
		// 			safelist: ['mt-48'], 
		// 		}
		// 	)]
		// 	: []),

		//...(process.env.NODE_ENV === 'production' ? [cssnano()] : [])
	]
};
