// import type { GridStore } from "../core/store";

// export function createEditor(mount: HTMLElement, store: GridStore) {
//   const el = document.createElement("textarea");
//   el.className = "sheet-editor";
//   el.style.position = "fixed";
//   el.style.display = "none";
//   mount.appendChild(el);

//   let current: { r:number; c:number } | null = null;

//   el.addEventListener("blur", () => {
//     if (!current) return;
//     store.setCell(current.r, current.c, el.value);
//     el.style.display = "none";
//     current = null;
//   });

//   el.addEventListener("keydown", (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       el.blur();
//       e.preventDefault();
//     }
//   });

//   function open(r:number, c:number, rect: DOMRect) {
//     current = { r, c };
//     const cell = store.getCell(r, c);
//     el.value = String(cell.value ?? "");
//     el.style.left = `${rect.left}px`;
//     el.style.top = `${rect.top}px`;
//     el.style.width = `${rect.width}px`;
//     el.style.height = `${rect.height}px`;
//     el.style.display = "block";
//     el.focus();
//     el.select();
//   }

//   return { open };
// }
