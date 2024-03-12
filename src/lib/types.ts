import { z } from 'zod';

export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email().optional(),
	photo: z.string().optional(),
	bio: z.string().optional()
});

export const UserCreateSchema = z.object({
	name: z.string({ invalid_type_error: 'Invalid name' }).min(1, 'Name cannot be empty'),
	email: z.string({ invalid_type_error: 'Invalid email' }).email().min(1, 'Email cannot be empty'),
	password: z
		.string({ invalid_type_error: 'Invalid password' })
		.min(8, 'Password must be at least 8 characters')
});
export const UserLoginSchema = UserCreateSchema.omit({ name: true });

export const PostSchema = z.object({
	title: z.string(),
	created: z.string(),
	content: z.string(),
	tags: z.array(z.string()),
	likes: z.array(z.string()),
	user: UserSchema,
	language: z.string()
});
export const PostCreateSchema = z.object({
	title: z.string({ invalid_type_error: 'Invalid title' }).min(1, 'Title cannot be empty'),
	content: z.string({ invalid_type_error: 'Invalid content' }).min(1, 'Content cannot be empty'),
	tags: z
		.preprocess(
			(t) => (isString(t) && isPrimitiveArray(JSON.parse(t), 'string') ? JSON.parse(t) : []),
			z
				.array(z.string({ invalid_type_error: 'Invalid item in tags' }))
				.min(1, 'Tags cannot be empty')
				.max(10, 'Cannot have more than 10 tags')
		)
		.refine((items) => new Set(items).size === items.length, {
			message: 'Cannot have duplicate tag'
		}),
	language: z.string({ invalid_type_error: 'Invalid language' }).min(1, 'Language cannot be empty')
});

export type User = z.infer<typeof UserSchema>;
export type Post = z.infer<typeof PostSchema>;

export function isValidUser(user: unknown): user is User {
	return UserSchema.safeParse(user).success;
}

export function isValidPost(post: unknown): post is Post {
	return PostSchema.safeParse(post).success;
}

export function isPrimitiveArray<T extends string | number | boolean>(
	value: unknown,
	type: 'string' | 'number' | 'boolean'
): value is T[] {
	return Array.isArray(value) && value.every((item) => typeof item === type);
}

export function isString(value: unknown): value is string {
	return typeof value === 'string';
}
