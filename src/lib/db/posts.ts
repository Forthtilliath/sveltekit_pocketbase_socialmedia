import { pb } from '$lib/pocketbase';
import { type Post, isValidPost } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { RecordModel } from 'pocketbase';
import { get } from 'svelte/store';

export async function getAllPosts(fetch: App.LoadFetch): Promise<(Post & RecordModel)[]> {
	const pbInstance = get(pb);
	if (!pbInstance) error(503, 'Service unavailable. Please try again later.');

	const posts = await pbInstance.collection<Post & RecordModel>('posts').getList(1, 15, {
		expand: 'user',
		sort: '-created',
		fetch
	});

	return posts.items.reduce<(Post & RecordModel)[]>((prev, post) => {
		if (!post.expand) {
			return prev;
		}

		post.user = post.expand.user;

		if (!isValidPost(post)) {
			return prev;
		}

		return [...prev, post];
	}, []);
}

export async function getPostById(id: string, fetch: App.LoadFetch) {
	const pbInstance = get(pb);
	if (!pbInstance) {
		return null;
	}

	try {
		const result = await pbInstance.collection('posts').getOne(id, {
			expand: 'user',
			fetch
		});

		const post = result;

		if (!result.expand) {
			return null;
		}

		post.user = result.expand.user;

		if (!isValidPost(post)) {
			return null;
		}

		return post;
	} catch (error) {
		if (error instanceof Error) {
			return {
				message: error.message
			};
		}
		return {
			message: 'Unknown error'
		};
	}
}

export async function getPostsByUserid(userid: string, fetch: App.LoadFetch) {
	const pbInstance = get(pb);
	if (!pbInstance) {
		return null;
	}

	const posts = await pbInstance.collection('posts').getFullList<Post & RecordModel>({
		filter: `user="${userid}"`,
		expand: 'user',
		fetch
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
