import { isValidPost, isValidUser, type Post } from '$lib/types.js';
import { redirect } from '@sveltejs/kit';
import type { RecordModel } from 'pocketbase';

export const actions = {
	toggleLiked: async ({ locals, params, url }) => {
		const authModel = locals.pocketBase.authStore.model;
		if (!locals.pocketBase.authStore.isValid || !isValidUser(authModel)) {
			throw redirect(303, '/auth');
		}

		try {
			const postRecord = await locals.pocketBase
				.collection('posts')
				.getOne<Post & RecordModel>(params.id, { expand: 'user' });

			const post = postRecord;

			if (!postRecord.expand) {
				throw new Error('Invalid post');
			}

			post.user = postRecord.expand.user;

			if (!isValidPost(post)) {
				throw new Error('Invalid post');
			}

			const isLiked = post.likes.includes(authModel.id);

			if (isLiked) {
				await locals.pocketBaseAdmin.collection('posts').update(postRecord.id, {
					'likes-': authModel.id
				});
			} else {
				await locals.pocketBaseAdmin.collection('posts').update(postRecord.id, {
					'likes+': authModel.id
				});
			}
		} catch (error) {
			console.log(error);
			if (error instanceof Error) {
				return {
					message: error.message
				};
			}
			return {
				message: 'Unknown error occurred while toggling like'
			};
		}

		const customRedirectPath = url.searchParams.get('redirectTo');

		if (customRedirectPath) {
			throw redirect(303, `${url.origin}${customRedirectPath}`);
		}

		throw redirect(303, `/posts/${params.id}`);
	},

	deletePost: async ({ locals, params }) => {
		const authModel = locals.pocketBase.authStore.model;
		if (!locals.pocketBase.authStore.isValid || !isValidUser(authModel)) {
			throw redirect(303, '/auth');
		}

		try {
			const postRecord = await locals.pocketBase
				.collection('posts')
				.getOne<Post & RecordModel>(params.id, { expand: 'user' });

			const post = postRecord;

			if (!postRecord.expand) {
				throw new Error('Invalid post');
			}

			post.user = postRecord.expand.user;

			if (!isValidPost(post)) {
				throw new Error('Invalid post');
			}

			const ownsPost = post.user.id === authModel.id;

			if (!ownsPost) {
				throw new Error('Cannont delete post');
			}

			await locals.pocketBaseAdmin.collection('posts').delete(postRecord.id);
		} catch (error) {
			console.log(error);
			if (error instanceof Error) {
				return {
					message: error.message
				};
			}
			return {
				message: 'Unknown error occurred while deleting post'
			};
		}

		throw redirect(303, '/');
	}
};
