import type { GridStoreApi } from "../data/store";

export function useGridStorePlain(store: GridStoreApi) {
  return {
    getCell: (r: number, c: number) =>
      store.getState().getCell(r, c),

    setCell: (r: number, c: number, v: string) =>
      store.getState().setCell(r, c, v),

    appendRow: () =>
      store.getState().appendRow(),

    appendCol: () =>
      store.getState().appendCol(),
  };
}
