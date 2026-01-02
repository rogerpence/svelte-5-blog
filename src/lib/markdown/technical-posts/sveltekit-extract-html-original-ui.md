---
title: Original code with original UI to extract HTML from a page
description: Original code with original UI to extract HTML from a page
date_created: '2025-06-27T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - sveltekit
---
```js
<script lang="ts">
	import { getCurrentPageHtml, getPageHtmlViaApi } from '$lib/utils/email-html';
	import { page } from '$app/state';

	let isGettingHtml = false;
	let htmlResult = '';
	let error = '';

	async function getHtmlClientSide() {
		isGettingHtml = true;
		error = '';

		try {
			const html = await getCurrentPageHtml({
				includeStyles: true,
				removeInteractiveElements: true
			});
			htmlResult = html;
			console.log('Client-side HTML:', html);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown error';
			console.error('Error getting HTML:', err);
		} finally {
			isGettingHtml = false;
		}
	}

	async function getHtmlServerSide() {
		isGettingHtml = true;
		error = '';

		try {
			const currentUrl = window.location.href;
			const html = await getPageHtmlViaApi(currentUrl);
			htmlResult = html;
			console.log('Server-side HTML:', html);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown error';
			console.error('Error getting HTML:', err);
		} finally {
			isGettingHtml = false;
		}
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(htmlResult);
	}

	function downloadHtml() {
		const blob = new Blob([htmlResult], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `page-${Date.now()}.html`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class="email-html-extractor" data-email-extractor="component">
	<h2>Email HTML Extractor</h2>
	<p>Current page: <code>{page.url.pathname}</code></p>

	<div class="controls">
		<button on:click={getHtmlClientSide} disabled={isGettingHtml} class="btn btn-primary">
			{isGettingHtml ? 'Getting HTML...' : 'Get HTML (Client-side)'}
		</button>

		<button on:click={getHtmlServerSide} disabled={isGettingHtml} class="btn btn-secondary">
			{isGettingHtml ? 'Getting HTML...' : 'Get HTML (Server-side)'}
		</button>
	</div>

	{#if error}
		<div class="error">
			<strong>Error:</strong>
			{error}
		</div>
	{/if}

	{#if htmlResult}
		<div class="results">
			<div class="result-controls">
				<button on:click={copyToClipboard} class="btn btn-small"> Copy to Clipboard </button>
				<button on:click={downloadHtml} class="btn btn-small"> Download HTML </button>
			</div>

			<details>
				<summary>View HTML ({htmlResult.length.toLocaleString()} characters)</summary>
				<pre class="html-preview">{htmlResult}</pre>
			</details>
		</div>
	{/if}
</div>

<style>
	.email-html-extractor {
		max-width: 800px;
		margin: 2rem auto;
		padding: 2rem;
		border: 1px solid #ddd;
		border-radius: 8px;
	}

	.controls {
		display: flex;
		gap: 1rem;
		margin: 1rem 0;
	}

	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
	}

	.btn-primary {
		background: #007acc;
		color: white;
	}

	.btn-secondary {
		background: #6c757d;
		color: white;
	}

	.btn-small {
		padding: 0.25rem 0.5rem;
		font-size: 0.875rem;
		background: #28a745;
		color: white;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn:hover:not(:disabled) {
		opacity: 0.9;
	}

	.error {
		background: #f8d7da;
		color: #721c24;
		padding: 1rem;
		border-radius: 4px;
		margin: 1rem 0;
	}

	.results {
		margin-top: 2rem;
	}

	.result-controls {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.html-preview {
		background: #f8f9fa;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		max-height: 400px;
		overflow-y: auto;
		white-space: pre-wrap;
		font-size: 0.875rem;
	}

	details summary {
		cursor: pointer;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	code {
		background: #f8f9fa;
		padding: 0.25rem 0.5rem;
		border-radius: 3px;
		font-family: 'Courier New', monospace;
	}
</style>

```