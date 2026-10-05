import { memo } from 'react';
import type { Position } from '../types/chess';

type SquareProps = Position & {
  hasKnight: boolean;
  canMove: boolean;
  onMove: (row: number, column: number) => void;
};

const Square = memo(function Square({ row, column, hasKnight, canMove, onMove }: SquareProps) {
  const colorClass = (row + column) % 2 === 0 ? 'black' : 'white';
  const moveClass = canMove ? 'valid' : 'invalid';

  function handleClick() {
    if (canMove) onMove(row, column);
  }

  return (
    <button
      type="button"
      className={`square ${colorClass} ${moveClass}`}
      aria-label={`Row ${row + 1}, column ${column + 1}${hasKnight ? ', knight' : ''}`}
      aria-pressed={hasKnight}
      onClick={handleClick}
    >
      {hasKnight ? 'K' : null}
    </button>
  );
});

export default Square;
