<script>
	// @ts-nocheck
	export let src;
	export let alt;
	export let width;
	export let alignment = 'left';
	export let caption = '';
	export let hide_caption = false;
	export let caption_class = '';

	let cssClass;

	switch (alignment.toLocaleLowerCase()) {
		case 'center':
			cssClass = 'flex-center';
			break;
		case 'start':
			cssClass = 'flex-start';
			break;
		case 'end':
			cssClass = 'flex-end';
			break;
	}
	//hide_caption = (caption.trim().length === 0)

	if (caption.trim().length === 0) {
		caption = alt;
	}

	// if (caption.trim().length > 0) {
	// 	caption = `${caption.trim()} ${alt.trim()}`
	// }

	cssClass = `${cssClass} flex-column mt-2 mb-2`;

	caption = caption.trim() + ' ';
</script>

{#if alignment == 'float-right'}
	<div class={cssClass}>
		<img
			{src}
			{alt}
			{width}
			style="float:right; margin-left: 20px; margin-bottom: 1rem;"
			height="auto"
		/>
		{#if !hide_caption}
			<div class={caption_class}>{caption}</div>
		{/if}
	</div>
{:else}
	<div class={cssClass}>
		<img {src} {alt} {width} height="auto" />
		{#if !hide_caption}
			<div class={caption_class}>{caption}</div>
		{/if}
	</div>
{/if}
