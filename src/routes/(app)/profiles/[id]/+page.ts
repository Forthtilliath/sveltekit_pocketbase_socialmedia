import { pb } from '$lib/pocketbase';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { isValidPost, isValidUser, type Post } from '$lib/types';
import type { RecordModel } from 'pocketbase';
import type Client from 'pocketbase';

export const load = (async ({ params }) => {
	const pbInstance = get(pb);

	if (!pbInstance) {
		return {
			result: {
				'not-found': true
			}
		};
	}

	try {
		const user = await pbInstance.collection('users').getOne(params.id);

		if (!isValidUser(user)) {
			throw new Error('Post not found');
		}

		return {
			result: {
				user,
				posts: getPosts(pbInstance, user)
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

async function getPosts(pbInstance: Client, user: RecordModel) {
	if (!pbInstance) {
		throw new Error('User not found');
	}

	const posts = await pbInstance.collection('posts').getFullList<Post & RecordModel>({
		filter: `user="${user.id}"`,
		expand: 'user'
	});

	return posts.reduce<(Post & RecordModel)[]>((prev, cur) => {
		const post = cur;

		if (!cur.expand) {
			return prev;
		}

		post.user = cur.expand.user;

		if (!isValidPost(post)) {
			return prev;
		}

		return [...prev, post];
	}, []);
}
