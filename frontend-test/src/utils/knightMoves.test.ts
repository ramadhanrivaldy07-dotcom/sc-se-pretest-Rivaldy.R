import { describe, expect, it } from 'vitest';
import { getKnightMoves } from './knightMoves';

describe('knight moves', () => {
  it('allows exactly eight L-shaped destinations in the center', () => {
    expect(getKnightMoves({ row: 3, column: 3 }, { rows: 8, columns: 8 }))
      .toEqual(new Set(['2:5', '4:5', '2:1', '4:1', '1:4', '5:4', '1:2', '5:2']));
  });
  it('clips destinations at the top-left corner', () => {
    expect(getKnightMoves({ row: 0, column: 0 }, { rows: 8, columns: 8 }))
      .toEqual(new Set(['1:2', '2:1']));
  });
  it('clips destinations on a rectangular board', () => {
    expect(getKnightMoves({ row: 2, column: 4 }, { rows: 3, columns: 5 }))
      .toEqual(new Set(['1:2', '0:3']));
  });
  it('has no destinations on a one-row board', () => {
    expect(getKnightMoves({ row: 0, column: 0 }, { rows: 1, columns: 100 }).size).toBe(0);
  });
});
