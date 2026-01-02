<script>
	// @ts-nocheck
	export let icon = '';
	export let image = '';
	export let alt = '';
	export let font_size = '';
	export let font_style = '';

	if (font_style == 'italic') {
		font_style = 'font-style: italic; ';
	}

	if (alt == '') {
		alt = 'icon or image indicating a callout';
	}

	if (font_size != '') {
		font_size = `font-size: ${font_size}; `;
	}
</script>

<div class="asna-callout-container">
	{#if icon != ''}
		<i
			role="img"
			alria-label={alt}
			class={icon}
			style="color: #f7640f;font-size: 2.5rem"
			aria-hidden="true"
		></i>
	{/if}
	{#if image != ''}
		<img {alt} width="70" src={image} />
	{/if}

	<div style="{font_size}{font_style}line-height: 1.6rem;">
		<slot />
	</div>
</div>

<!-- <style>
	i, img, p {
		outline: 1px solid blue;
	}
</style> -->
