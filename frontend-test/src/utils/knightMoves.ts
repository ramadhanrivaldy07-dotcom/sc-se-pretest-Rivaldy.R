import type { Dimensions, Position } from '../types/chess';

const offsets = [
  [-1, 2], [1, 2], [-1, -2], [1, -2],
  [-2, 1], [2, 1], [-2, -1], [2, -1],
] as const;

export const positionKey = (row: number, column: number) => `${row}:${column}`;

export function getKnightMoves(position: Position, dimensions: Dimensions): Set<string> {
  const moves = new Set<string>();
  for (const [rowOffset, columnOffset] of offsets) {
    const row = position.row + rowOffset;
    const column = position.column + columnOffset;
    if (row >= 0 && row < dimensions.rows && column >= 0 && column < dimensions.columns) {
      moves.add(positionKey(row, column));
    }
  }
  return moves;
}
