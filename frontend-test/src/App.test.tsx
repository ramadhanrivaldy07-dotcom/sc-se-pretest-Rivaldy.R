import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

function getSquare(row: number, column: number) {
  return screen.getByRole('button', {
    name: new RegExp(`^Row ${row}, column ${column}(, knight)?$`),
  });
}

function getSquares() {
  return within(screen.getByRole('region', { name: 'Chess board' })).getAllByRole('button');
}

function generateBoard() {
  fireEvent.click(screen.getByRole('button', { name: 'Generate Board' }));
}

function changeDimension(label: 'Row' | 'Column', value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

describe('Chess Lonely Knight', () => {
  it('starts with 64 squares, one knight, and valid/invalid destination classes', () => {
    render(<App />);

    expect(getSquares()).toHaveLength(64);
    expect(screen.getAllByText('K')).toHaveLength(1);
    expect(getSquare(1, 1)).toHaveTextContent('K');
    expect(getSquare(1, 1)).toHaveClass('invalid', 'black');
    expect(getSquare(2, 3)).toHaveClass('valid');
    expect(getSquare(3, 2)).toHaveClass('valid');
    expect(getSquare(1, 2)).toHaveClass('invalid', 'white');
  });

  it('ignores invalid clicks and updates legal destinations after a valid move', () => {
    render(<App />);

    fireEvent.click(getSquare(1, 2));
    fireEvent.click(getSquare(1, 1));
    expect(getSquare(1, 1)).toHaveTextContent('K');
    fireEvent.click(getSquare(2, 3));
    expect(getSquare(2, 3)).toHaveTextContent('K');
    expect(getSquare(1, 1)).toBeEmptyDOMElement();
    expect(getSquare(1, 1)).toHaveClass('valid');
    expect(screen.getAllByText('K')).toHaveLength(1);
  });

  it('resets the knight when generating the same dimensions', () => {
    render(<App />);

    fireEvent.click(getSquare(2, 3));
    generateBoard();
    expect(getSquare(1, 1)).toHaveTextContent('K');
  });

  it('applies new dimensions only on generate and resets the knight', () => {
    render(<App />);

    fireEvent.click(getSquare(2, 3));
    changeDimension('Row', '3');
    changeDimension('Column', '5');
    expect(getSquares()).toHaveLength(64);
    generateBoard();
    expect(getSquares()).toHaveLength(15);
    expect(getSquare(1, 1)).toHaveTextContent('K');
  });

  it('preserves the board and knight when validation fails', () => {
    render(<App />);

    fireEvent.click(getSquare(2, 3));
    changeDimension('Row', '101');
    generateBoard();
    expect(screen.getByRole('alert')).toBeVisible();
    expect(getSquare(2, 3)).toHaveTextContent('K');
    expect(getSquares()).toHaveLength(64);
  });

  it.each(['Row', 'Column'] as const)('marks only the invalid %s input and clears errors after correction', label => {
    render(<App />);
    const otherLabel = label === 'Row' ? 'Column' : 'Row';

    changeDimension(label, '101');
    generateBoard();

    expect(screen.getByLabelText(label)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(otherLabel)).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-describedby', 'input-error');
    expect(screen.getByLabelText(otherLabel)).not.toHaveAttribute('aria-describedby');

    changeDimension(label, '8');
    generateBoard();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByLabelText(label)).toHaveAttribute('aria-invalid', 'false');
    expect(getSquare(1, 1)).toHaveTextContent('K');
  });
});
