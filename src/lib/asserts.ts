export function assertsIsNotNull<T>(
	value: T | null | undefined,
	message?: 'Value cannot be null'
): asserts value is T {
	if (value == null) {
		throw new Error(message);
	}
}

export function assertsIsFile(file: unknown, message?: string): asserts file is File {
	if (!(file instanceof File) || file.size === 0) {
		throw new Error(message ?? 'File is not an instance of File');
	}
}

export function assertsIsStringNotEmpty(value: unknown, message?: string): asserts value is string {
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error(message ?? 'Value is not a non-empty string');
	}
}
