import { useCallback, useMemo, useState } from 'react';
import type { Dimensions, Position } from '../types/chess';
import { getKnightMoves, positionKey } from '../utils/knightMoves';
import Square from './Square';

export default function Board({ rows, columns }: Dimensions) {
  const [knight, setKnight] = useState<Position>({ row: 0, column: 0 });
  const validMoves = useMemo(
    () => getKnightMoves(knight, { rows, columns }),
    [knight, rows, columns],
  );

  const handleMove = useCallback((row: number, column: number) => {
    setKnight(previous => {
      const destinations = getKnightMoves(previous, { rows, columns });
      if (!destinations.has(positionKey(row, column))) return previous;

      return { row, column };
    });
  }, [rows, columns]);

  return (
    <div className="board-viewport" role="region" aria-label="Chess board" tabIndex={0}>
      <div className="board" style={{ gridTemplateColumns: `repeat(${columns}, var(--square-size))` }}>
        {Array.from({ length: rows * columns }, (_, index) => {
          const row = Math.floor(index / columns);
          const column = index % columns;
          return (
            <Square
              key={index}
              row={row}
              column={column}
              hasKnight={knight.row === row && knight.column === column}
              canMove={validMoves.has(positionKey(row, column))}
              onMove={handleMove}
            />
          );
        })}
      </div>
    </div>
  );
}
