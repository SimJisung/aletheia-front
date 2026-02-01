/**
 * Route parameter validation utilities
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates that a parameter is a valid UUID string
 * @throws Error if the parameter is invalid
 */
export function validateUuidParam(value: unknown, paramName: string): string {
  if (typeof value !== 'string') {
    throw new Error(`Invalid ${paramName}: expected string`);
  }

  if (!UUID_REGEX.test(value)) {
    throw new Error(`Invalid ${paramName}: not a valid UUID`);
  }

  return value;
}

/**
 * Validates that a parameter is a non-empty string
 * @throws Error if the parameter is invalid
 */
export function validateStringParam(value: unknown, paramName: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid ${paramName}: expected non-empty string`);
  }

  return value;
}

/**
 * Safely extracts and validates a UUID param, returning null if invalid
 */
export function safeUuidParam(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  return UUID_REGEX.test(value) ? value : null;
}

/**
 * Checks if a value is a valid UUID
 */
export function isValidUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_REGEX.test(value);
}
