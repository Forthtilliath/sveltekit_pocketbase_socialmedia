<script lang="ts">
	import Post from '$lib/components/Post.svelte';

	export let data;
</script>

<svelte:head>
	<title>
		{data.post ? data.post.title : 'Post not found'}
	</title>
</svelte:head>

<div class="container">
	<article>
		{#if data.post}
			<Post authModel={data.authModel} post={data.post} />
		{:else}
			<p class="not-found">Post not found</p>
		{/if}
	</article>
</div>

<style>
	.container {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-wrap: wrap;
	}

	article {
		background-color: var(--primary-color);
		border-radius: 8px;
		width: 45rem;
		max-width: 60vw;
		flex-grow: 1;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
