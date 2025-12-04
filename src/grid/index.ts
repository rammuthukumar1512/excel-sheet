// import { createGridStore } from "../core/store";
// import type { GridStoreApi } from "../core/store";
// import { Renderer } from "./renderer";

// export type CreateGridOptions = {
//   mount: HTMLElement;
//   rows: number;
//   cols: number;
// };

// export function createGrid(options: CreateGridOptions) {
//   const { mount, rows, cols } = options;

//   const store: GridStoreApi = createGridStore({ rows, cols });

//   const renderer = new Renderer({ mount, store });
//   renderer.init();

//   return { store, renderer };
// }
