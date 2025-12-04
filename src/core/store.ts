// import { create } from "zustand";
// import { immer } from "zustand/middleware/immer";
// import type { Cell } from "../types/cell";

// export type GridStore = {
//   rows: number;
//   cols: number;
//   data: Cell[][];

//   setCell: (r: number, c: number, value: string) => void;
//   appendRow: () => void;
//   appendCol: () => void;
// };

// export type GridStoreApi = ReturnType<typeof createGridStore>;

// export function createGridStore(opts: { rows: number; cols: number }) {
//   const { rows, cols } = opts;

//   return create<GridStore>()(
//     immer((set) => ({
//       rows,
//       cols,

//       data: Array.from({ length: rows }, (_, r) =>
//         Array.from({ length: cols }, (_, c) => ({
//           r,
//           c,
//           value: "",
//         }))
//       ),

//       setCell: (r, c, value) =>
//         set((state) => {
//           state.data[r][c].value = value;
//         }),

//       appendRow: () =>
//         set((state) => {
//           const newRowIndex = state.rows;
//           const newRow = Array.from({ length: state.cols }, (_, c) => ({
//             r: newRowIndex,
//             c,
//             value: "",
//           }));
//           state.data.push(newRow);
//           state.rows++;
//         }),

//       appendCol: () =>
//         set((state) => {
//           const newColIndex = state.cols;
//           for (let r = 0; r < state.rows; r++) {
//             state.data[r].push({
//               r,
//               c: newColIndex,
//               value: "",
//             });
//           }
//           state.cols++;
//         }),
//     }))
//   );
// }
