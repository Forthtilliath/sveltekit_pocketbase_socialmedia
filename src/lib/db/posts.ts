import { pb } from '$lib/pocketbase';
import { type Post, isValidPost } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { RecordModel } from 'pocketbase';
import { get } from 'svelte/store';

export async function getAllPosts(): Promise<(Post & RecordModel)[]> {
	const pbInstance = get(pb);
	if (!pbInstance) error(503, 'Service unavailable. Please try again later.');
	// if (!pbInstance) return [];

	const posts = await pbInstance.collection<Post & RecordModel>('posts').getList(1, 15, {
		expand: 'user',
		sort: '-created'
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

export async function getPostById(id: string) {
	const pbInstance = get(pb);
	if (!pbInstance) {
		return null;
	}

	try {
		const result = await pbInstance.collection('posts').getOne(id, {
			expand: 'user'
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
			console.log('====', error.message);
			return {
				message: error.message
			};
		}
		return {
			message: 'Unknown error'
		};
	}
}
