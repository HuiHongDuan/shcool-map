import { describe, expect, test } from 'vitest';
import { isWithinBbox, normalizeKeyword } from '@/lib/utils';

describe('utils', () => {
  test('normalizeKeyword trims and lowercase', () => {
    expect(normalizeKeyword('  JingAn ')).toBe('jingan');
  });

  test('isWithinBbox handles bbox filtering', () => {
    const item = { coordinates: [121.47, 31.23] } as const;
    expect(isWithinBbox(item as never, [121.4, 31.2, 121.5, 31.3])).toBe(true);
    expect(isWithinBbox(item as never, [121.5, 31.2, 121.6, 31.3])).toBe(false);
  });
});
