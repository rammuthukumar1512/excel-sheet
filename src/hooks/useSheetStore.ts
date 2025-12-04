// src/hooks/useSheetStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Cell } from '../types/cell';

type State = {
  rows: number;
  cols: number;
  data: Cell[][];
  setCellValue: (r: number, c: number, v: string) => void;
};

export const useSheetStore = create<State>()(
  immer((set) => ({
    rows: 50,
    cols: 26,
    data: Array.from({ length: 50 }, (_, r) =>
      Array.from({ length: 26 }, (_, c) => ({ r, c, value: '' }))
    ),

    setCellValue: (r, c, v) =>
      set((state) => {
        state.data[r][c].value = v;
      }),
  }))
);
