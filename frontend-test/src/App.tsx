import { useState, type FormEvent } from 'react';
import Board from './components/Board';
import type { Dimensions } from './types/chess';
import { DEFAULT_DIMENSION, MAX_DIMENSION, MIN_DIMENSION, parseDimension } from './utils/dimensions';

type DimensionErrors = { rows: boolean; columns: boolean };

export default function App() {
  const [rowInput, setRowInput] = useState(String(DEFAULT_DIMENSION));
  const [columnInput, setColumnInput] = useState(String(DEFAULT_DIMENSION));
  const [boardDimensions, setBoardDimensions] = useState<Dimensions>({
    rows: DEFAULT_DIMENSION,
    columns: DEFAULT_DIMENSION,
  });
  const [boardGeneration, setBoardGeneration] = useState(0);
  const [errors, setErrors] = useState<DimensionErrors>({ rows: false, columns: false });
  const hasError = errors.rows || errors.columns;

  function handleGenerateBoard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const rows = parseDimension(rowInput);
    const columns = parseDimension(columnInput);
    setErrors({ rows: rows === null, columns: columns === null });

    if (rows === null || columns === null) return;

    setBoardDimensions({ rows, columns });
    setBoardGeneration(previous => previous + 1);
  }

  return (
    <main className="chess-app">
      <h1 className="chess-title">Chess Lonely Knight</h1>

      <form className="board-form" onSubmit={handleGenerateBoard} noValidate>
        <label htmlFor="rows">Row</label>
        <input
          id="rows"
          type="number"
          min={MIN_DIMENSION}
          max={MAX_DIMENSION}
          step="1"
          required
          value={rowInput}
          onChange={event => setRowInput(event.target.value)}
          aria-invalid={errors.rows}
          aria-describedby={errors.rows ? 'input-error' : undefined}
        />

        <label htmlFor="columns">Column</label>
        <input
          id="columns"
          type="number"
          min={MIN_DIMENSION}
          max={MAX_DIMENSION}
          step="1"
          required
          value={columnInput}
          onChange={event => setColumnInput(event.target.value)}
          aria-invalid={errors.columns}
          aria-describedby={errors.columns ? 'input-error' : undefined}
        />

        <button className="generate" type="submit" aria-label="Generate Board">
          Generate<br />Board
        </button>
      </form>

      {hasError && (
        <p id="input-error" className="form-error" role="alert">
          Row and Column must be whole numbers from {MIN_DIMENSION} to {MAX_DIMENSION}.
        </p>
      )}

      <Board
        key={boardGeneration}
        rows={boardDimensions.rows}
        columns={boardDimensions.columns}
      />
    </main>
  );
}
