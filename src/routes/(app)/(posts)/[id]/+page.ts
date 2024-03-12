import { assertsIsNotNull } from '$lib/asserts';
import { pb } from '$lib/pocketbase';
import { isValidPost } from '$lib/types';
import type Client from 'pocketbase';
import { get } from 'svelte/store';

export const load = async ({ params }) => {
	const pbInstance = get(pb);
	if (!pbInstance) {
		return {
			'not-found': true
		};
	}

	try {
		return {
			post: await getPost(pbInstance, params.id)
		};
	} catch (error) {
		if (error instanceof Error) {
			console.log(error.message);
			return {
				message: error.message
			};
		}
		return {
			message: 'Unknown error'
		};
	}
};
async function getPost(pbInstance: Client, id: string) {
	assertsIsNotNull(pbInstance);

	const result = await pbInstance.collection('posts').getOne(id, {
		expand: 'user'
	});

	const post = result;

	if (!result.expand) {
		throw new Error('Post not found');
	}

	post.user = result.expand.user;

	if (!isValidPost(post)) {
		throw new Error('Post not found');
	}

	return post;
}
