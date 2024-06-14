import { isValidUser, type User } from '$lib/types';
import { BaseAuthStore } from 'pocketbase';

export function isAuthenticated(
	authStore: BaseAuthStore
): authStore is BaseAuthStore & { model: User } {
	return authStore.isValid && isValidUser(authStore.model);
}