export const MIN_DIMENSION = 1;
export const MAX_DIMENSION = 100;
export const DEFAULT_DIMENSION = 8;

export function parseDimension(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;

  const dimension = Number(value);
  const isValid = Number.isInteger(dimension)
    && dimension >= MIN_DIMENSION
    && dimension <= MAX_DIMENSION;

  return isValid ? dimension : null;
}
