import { getPostById } from '$lib/db/posts.js';
import { handleError } from '$lib/helpers.js';
import { pb } from '$lib/pocketbase';
import { get } from 'svelte/store';

export const load = async ({ params, fetch }) => {
	const pbInstance = get(pb);
	if (!pbInstance) {
		return {
			'not-found': true
		};
	}

	try {
		return {
			post: await getPostById(params.id, fetch)
		};
	} catch (error) {
		handleError('', 'Unknown error')(error);
	}
};
