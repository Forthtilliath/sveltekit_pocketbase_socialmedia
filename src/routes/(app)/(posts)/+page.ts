import { getAllPosts } from '$lib/db/posts';

export const load = async ({ fetch }) => {
	return {
		posts: getAllPosts(fetch)
	};
};
