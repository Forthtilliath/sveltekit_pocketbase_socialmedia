/**
 * The function `handleError` takes an error key and message, and returns a function that handles
 * errors by checking if the error is an instance of Error and returning the error key and message
 * accordingly.
 * @param {string} errorKey - The `errorKey` parameter in the `handleError` function is a string that
 * represents a key or identifier for the type of error that occurred. It is used to categorize and
 * identify different types of errors within the error handling logic.
 * @param {string} message - The `message` parameter in the `handleError` function is a string that
 * represents the custom error message you want to associate with the error key. It is used to provide
 * additional context or details about the error that occurred.
 * @returns The `handleError` function returns a function that takes an `error` parameter. If the
 * `error` parameter is an instance of `Error`, it returns an object with the `error` key set to the
 * `errorKey` parameter and the `message` key set to the `error.message`. If the `error` parameter is
 * not an instance of `Error`, it returns an object with the `error` key set to the `errorKey` parameter
 * and the `message` key set to the `message` parameter.
 */
export function handleError(errorKey: string, message: string): (error: unknown) => App.Error {
	return (error: unknown) => {
		if (error instanceof Error) {
			return {
				error: errorKey,
				message: error.message
			};
		}
		return {
			error: errorKey,
			message
		};
	};
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

export function isAppError(value: unknown): value is App.Error {
	return (
		value != null &&
		typeof value === 'object' &&
		'error' in value &&
		'message' in value
	);
}