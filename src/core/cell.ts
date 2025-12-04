export type CellValue = string | number | null;

export interface Cell {
  r: number;
  c: number;
  value: CellValue;
  formula?: string | null;
  formats?: Record<string, any>;
  meta?: Record<string, any>;
  version?: number;
}
