// import type { GridStoreApi } from "../core/store";

// type RendererOptions = {
//   mount: HTMLElement;
//   store: GridStoreApi;
// };

// export class Renderer {
//   private mount: HTMLElement;
//   private store: GridStoreApi;

//   constructor(options: RendererOptions) {
//     this.mount = options.mount;
//     this.store = options.store;
//   }

//   init() {
//     this.renderTable();
//   }

//   renderTable() {
//     const state = this.store.getState();
//     const { rows, cols, data } = state;

//     const table = document.createElement("table");
//     table.className = "sheet-table";

//     for (let r = 0; r < rows; r++) {
//       const tr = document.createElement("tr");

//       for (let c = 0; c < cols; c++) {
//         const td = document.createElement("td");
//         td.className = "cell";
//         td.textContent = String(data[r][c].value ?? "");

//         td.addEventListener("dblclick", () => {
//           const value = prompt("Edit cell", String(data[r][c].value ?? "")) ?? "";
//           this.store.getState().setCell(r, c, value);
//           this.refresh();
//         });

//         tr.appendChild(td);
//       }

//       table.appendChild(tr);
//     }

//     this.mount.innerHTML = "";
//     this.mount.appendChild(table);
//   }

//   refresh() {
//     this.renderTable();
//   }
// }
