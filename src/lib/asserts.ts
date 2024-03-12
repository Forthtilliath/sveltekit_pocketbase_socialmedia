export function assertsIsNotNull<T>(
	value: T | null | undefined,
	message?: 'Value cannot be null'
): asserts value is T {
	if (value == null) {
		throw new Error(message);
	}
}
