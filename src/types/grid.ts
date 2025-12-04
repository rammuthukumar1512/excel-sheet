// src/types/grid.ts
import type { Cell } from './cell';

export interface GridSnapshot {
  rows: number;
  cols: number;
  cells: Partial<Record<string, Cell>>; // sparse map keyed as "r:c"
}

export type CellKey = `${number}:${number}`;
