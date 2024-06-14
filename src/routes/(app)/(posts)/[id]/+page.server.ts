import { isAuthenticated } from '$lib/db/auth.js';
import { handleError } from '$lib/helpers.js';
import { isValidPost, type Post } from '$lib/types.js';
import { redirect } from '@sveltejs/kit';
import type { RecordModel } from 'pocketbase';

export const actions = {
	toggleLiked: async ({ locals, params, url }) => {
		if (!isAuthenticated(locals.pocketBase.authStore)) {
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

			const isLiked = post.likes.includes(locals.pocketBase.authStore.model.id);

			if (isLiked) {
				await locals.pocketBaseAdmin.collection('posts').update(postRecord.id, {
					'likes-': locals.pocketBase.authStore.model.id
				});
			} else {
				await locals.pocketBaseAdmin.collection('posts').update(postRecord.id, {
					'likes+': locals.pocketBase.authStore.model.id
				});
			}
		} catch (error) {
			handleError('toggle-liked', 'An error occurred while toggling like')(error);
		}

		const customRedirectPath = url.searchParams.get('redirectTo');

		if (customRedirectPath) {
			throw redirect(303, `${url.origin}${customRedirectPath}`);
		}

		throw redirect(303, `/${params.id}`);
	},

	deletePost: async ({ locals, params }) => {
		if (!isAuthenticated(locals.pocketBase.authStore)) {
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

			const ownsPost = post.user.id === locals.pocketBase.authStore.model.id;

			if (!ownsPost) {
				throw new Error('Cannot delete post');
			}

			await locals.pocketBaseAdmin.collection('posts').delete(postRecord.id);
		} catch (error) {
			handleError('delete-post', 'An error occurred while deleting a post')(error);
		}

		throw redirect(303, '/');
	}
};
