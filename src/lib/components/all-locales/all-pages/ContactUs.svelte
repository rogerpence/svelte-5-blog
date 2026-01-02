<script lang="ts">
	//import { setUserState, getUserState } from '$lib/userState';
	import { browser } from '$app/environment';

	// let state = getUserState();

	export let formTitle;
	export let formSource;
	export let formText;
	export let formStyle = 'link';

	let classes = formStyle == 'link' ? 'fake-anchor' : 'base-button';

	// const showContactUs = () => {
	// 	// if (browser) {
	// 	// 	$state.showContactUsForm = true;
	// 	// 	$state.contactUsFormTitle = formTitle;
	// 	// 	$state.contactUsFormSource = formSource;
	// 	// 	$state.emailKey = 'generic';
	// 	// 	$state.contactUsTargetUrl = window.location.href;
	// 	}
	// };

	let js = 'javascript:void(0)';
</script>

<!-- {#if formStyle == 'link'}
	<a
		href={js}
		style="cursor: pointer;z-index: 60;"
		tabindex="0"
		role="button"
		on:keypress={null}
		on:click={showContactUs}>{formText}</a
	>
{:else}
	<button style="z-index: 60;" class={classes} on:click={showContactUs}>{formText}</button>
{/if} -->
