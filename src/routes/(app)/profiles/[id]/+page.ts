import { pb } from '$lib/pocketbase';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { isValidUser } from '$lib/types';
import { getPostsByUserid } from '$lib/db/posts';

export const load = (async ({ params, fetch }) => {
	const pbInstance = get(pb);

	if (!pbInstance) {
		return {
			result: {
				'not-found': true
			}
		};
	}

	try {
		const user = await pbInstance.collection('users').getOne(params.id, { fetch });

		if (!isValidUser(user)) {
			throw new Error('Post not found');
		}

		return {
			result: {
				user,
				posts: getPostsByUserid(user.id, fetch)
			}
		};
	} catch (error) {
		return {
			result: {
				'not-found': true
			}
		};
	}
}) satisfies PageLoad;
