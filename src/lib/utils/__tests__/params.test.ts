import { describe, it, expect } from 'vitest';
import { validateUuidParam, validateStringParam, safeUuidParam, isValidUuid } from '../params';

describe('validateUuidParam', () => {
  it('returns valid UUID string', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    expect(validateUuidParam(uuid, 'id')).toBe(uuid);
  });

  it('throws for non-string value', () => {
    expect(() => validateUuidParam(123, 'id')).toThrow('Invalid id: expected string');
    expect(() => validateUuidParam(null, 'id')).toThrow('Invalid id: expected string');
    expect(() => validateUuidParam(undefined, 'id')).toThrow('Invalid id: expected string');
  });

  it('throws for invalid UUID format', () => {
    expect(() => validateUuidParam('not-a-uuid', 'id')).toThrow('Invalid id: not a valid UUID');
    expect(() => validateUuidParam('', 'id')).toThrow('Invalid id: not a valid UUID');
    expect(() => validateUuidParam('123', 'id')).toThrow('Invalid id: not a valid UUID');
  });

  it('accepts various valid UUID versions', () => {
    // UUID v1
    expect(validateUuidParam('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'id')).toBeTruthy();
    // UUID v4
    expect(validateUuidParam('550e8400-e29b-41d4-a716-446655440000', 'id')).toBeTruthy();
    // UUID v5
    expect(validateUuidParam('74738ff5-5367-5958-9aee-98fffdcd1876', 'id')).toBeTruthy();
  });

  it('is case insensitive', () => {
    const upperUuid = '123E4567-E89B-12D3-A456-426614174000';
    const lowerUuid = '123e4567-e89b-12d3-a456-426614174000';
    expect(validateUuidParam(upperUuid, 'id')).toBe(upperUuid);
    expect(validateUuidParam(lowerUuid, 'id')).toBe(lowerUuid);
  });
});

describe('validateStringParam', () => {
  it('returns valid non-empty string', () => {
    expect(validateStringParam('hello', 'name')).toBe('hello');
    expect(validateStringParam('  hello  ', 'name')).toBe('  hello  ');
  });

  it('throws for non-string value', () => {
    expect(() => validateStringParam(123, 'name')).toThrow('Invalid name: expected non-empty string');
    expect(() => validateStringParam(null, 'name')).toThrow('Invalid name: expected non-empty string');
  });

  it('throws for empty or whitespace-only string', () => {
    expect(() => validateStringParam('', 'name')).toThrow('Invalid name: expected non-empty string');
    expect(() => validateStringParam('   ', 'name')).toThrow('Invalid name: expected non-empty string');
  });
});

describe('safeUuidParam', () => {
  it('returns UUID for valid input', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    expect(safeUuidParam(uuid)).toBe(uuid);
  });

  it('returns null for invalid UUID', () => {
    expect(safeUuidParam('not-a-uuid')).toBeNull();
    expect(safeUuidParam('')).toBeNull();
  });

  it('returns null for non-string values', () => {
    expect(safeUuidParam(123)).toBeNull();
    expect(safeUuidParam(null)).toBeNull();
    expect(safeUuidParam(undefined)).toBeNull();
    expect(safeUuidParam({})).toBeNull();
  });
});

describe('isValidUuid', () => {
  it('returns true for valid UUID', () => {
    expect(isValidUuid('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    expect(isValidUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('returns false for invalid UUID', () => {
    expect(isValidUuid('not-a-uuid')).toBe(false);
    expect(isValidUuid('')).toBe(false);
    expect(isValidUuid('123')).toBe(false);
  });

  it('returns false for non-string values', () => {
    expect(isValidUuid(123)).toBe(false);
    expect(isValidUuid(null)).toBe(false);
    expect(isValidUuid(undefined)).toBe(false);
  });
});
