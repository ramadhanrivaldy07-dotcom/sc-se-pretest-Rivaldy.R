import { describe, expect, it } from 'vitest';
import { parseDimension } from './dimensions';

describe('parseDimension', () => {
  it.each(['', '0', '-1', '101', '1.5', 'abc', 'Infinity', '1e2'])(
    'rejects %j',
    value => {
      expect(parseDimension(value)).toBeNull();
    },
  );

  it.each([1, 8, 100])('accepts %i', value => {
    expect(parseDimension(String(value))).toBe(value);
  });
});
