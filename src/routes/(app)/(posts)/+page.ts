import { getAllPosts } from '$lib/db/posts';

export const load = async () => {
	return {
		posts: getAllPosts()
	};
};