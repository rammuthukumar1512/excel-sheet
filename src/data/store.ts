import { createStore as createVanillaStore } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";

export type CellValue = string | number | null;

export type GridStore = {
  rows: number;
  cols: number;
  data: CellValue[][];
  getCell: (r: number, c: number) => CellValue;
  setCell: (r: number, c: number, v: CellValue) => void;
  appendRow: () => void;
  appendCol: () => void;
};

export function createStore({ rows, cols }: { rows: number; cols: number }) {
  return createVanillaStore<GridStore>()(
    immer((set, get) => ({
      rows,
      cols,

      data: Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => "")
      ),

      getCell: (r, c) => get().data[r][c],

      setCell: (r, c, v) =>
        set((state) => {
          state.data[r][c] = v;
        }),

      appendRow: () =>
        set((state) => {
          state.data.push(Array.from({ length: state.cols }, () => ""));
          state.rows++;
        }),

      appendCol: () =>
        set((state) => {
          for (const row of state.data) row.push("");
          state.cols++;
        }),
    }))
  );
}

// Export the Store API type (Zustand vanilla store)
export type GridStoreApi = ReturnType<typeof createStore>;
