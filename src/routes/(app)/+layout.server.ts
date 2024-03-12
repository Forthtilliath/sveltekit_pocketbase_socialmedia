import { UserSchema } from '$lib/types';
import type { z } from 'zod';

type Auth = {
	authenticated: true;
	authModel: z.infer<typeof UserSchema>;
};
type NoAuth = {
	authenticated: false;
	authModel: null;
};

export const load = async ({ locals }): Promise<Auth | NoAuth> => {
	const authenticated = locals.pocketBase.authStore.isValid;
	const authModelSF = UserSchema.safeParse(locals.pocketBase.authStore.model);

	if (authenticated && authModelSF.success) {
		return { authenticated: true, authModel: authModelSF.data };
	}

	return { authenticated: false, authModel: null };
};
