// type Store = ReturnType<typeof import('../data/store').createStore>;
// type Viewport = ReturnType<typeof import('./viewport').createViewport>;

// export function createRenderer(args: { mount: HTMLElement; store: Store; viewport: Viewport }) {
//   const { mount, store, viewport } = args;
//   const root = viewport.container;
//   const gridEl = document.createElement('div');
//   gridEl.className = 'sheet-grid';
//   root.appendChild(gridEl);

//   let active: { r: number; c: number } | null = null;
//   let onCellDoubleClick: ((r: number, c: number, rect: DOMRect) => void) | null = null;
//   let onCellClick: ((r: number, c: number) => void) | null = null;

//   // Pools to reuse DOM nodes (reduces GC and improves scroll perf)
//   const rowPool: HTMLDivElement[] = [];
//   const cellPool: HTMLDivElement[] = [];

//   function createRowEl(): HTMLDivElement {
//     const row = document.createElement('div');
//     row.className = 'sheet-row';
//     return row;
//   }

//   function createCellEl(): HTMLDivElement {
//     const cell = document.createElement('div');
//     cell.className = 'sheet-cell';
//     return cell;
//   }

//   function getRowFromPool(): HTMLDivElement {
//     return rowPool.pop() ?? createRowEl();
//   }

//   function getCellFromPool(): HTMLDivElement {
//     return cellPool.pop() ?? createCellEl();
//   }

//   function recycleRow(rowEl: HTMLDivElement) {
//     // detach children and push them to cellPool
//     while (rowEl.firstChild) {
//       const child = rowEl.firstChild as HTMLDivElement;
//       // remove event handlers (avoid memory leaks)
//       child.onclick = null;
//       child.ondblclick = null;
//       child.textContent = '';
//       rowEl.removeChild(child);
//       cellPool.push(child);
//     }
//     rowPool.push(rowEl);
//   }

//   function clearGridKeepPools() {
//     // move all current children (rows) into pools
//     while (gridEl.firstChild) {
//       const row = gridEl.firstChild as HTMLDivElement;
//       gridEl.removeChild(row);
//       recycleRow(row);
//     }
//   }

//   function buildVisible() {
//     const { rowHeight, colWidth } = viewport;
//     const { top } = viewport.getScroll();
//     const viewHeight = viewport.size().height;
//     const firstRow = Math.floor(top / rowHeight);
//     const visibleRows = Math.ceil(viewHeight / rowHeight) + 8; // buffer

//     // recycle existing DOM nodes back to pools
//     clearGridKeepPools();

//     const rowsCount = store.grid.length;
//     const colsCount = store.grid[0]?.length ?? 0;

//     const start = Math.max(0, firstRow);
//     const end = Math.min(rowsCount, firstRow + visibleRows);

//     // create rows and cells for the visible window
//     for (let r = start; r < end; r++) {
//       const rowEl = getRowFromPool();
//       rowEl.style.height = rowHeight + 'px';
//       // ensure row has no leftover children (it shouldn't, but clear defensively)
//       while (rowEl.firstChild) {
//         const child = rowEl.firstChild as HTMLDivElement;
//         rowEl.removeChild(child);
//         child.onclick = null;
//         child.ondblclick = null;
//         cellPool.push(child);
//       }

//       // create/populate cells for this row
//       for (let c = 0; c < colsCount; c++) {
//         const cellEl = getCellFromPool();
//         const cell = store.getCell(r, c);

//         // update layout + content
//         cellEl.style.width = colWidth + 'px';
//         cellEl.textContent = String(cell.value ?? '');
//         cellEl.dataset.r = String(r);
//         cellEl.dataset.c = String(c);

//         // bind events (re-binding is cheap compared to creating nodes)
//         cellEl.onclick = () => {
//           setActive(r, c);
//           onCellClick && onCellClick(r, c);
//         };
//         cellEl.ondblclick = (ev) => {
//           // compute rect relative to viewport container (or use getBoundingClientRect)
//           const rect = cellEl.getBoundingClientRect();
//           onCellDoubleClick && onCellDoubleClick(r, c, rect);
//         };

//         if (active && active.r === r && active.c === c) {
//           cellEl.classList.add('active');
//         } else {
//           cellEl.classList.remove('active');
//         }

//         rowEl.appendChild(cellEl);
//       }

//       gridEl.appendChild(rowEl);
//     }
//   }

//   function render() {
//     buildVisible();
//   }

//   function refresh() {
//     render();
//   }

//   function setActive(r: number, c: number) {
//     active = { r, c };
//     refresh();
//   }

//   function applyDiffs(_diffs: any[]) {
//     // For phase-0 prototype we simply refresh visible window.
//     // Later we can optimize to update specific visible cells only.
//     refresh();
//   }

//   // rerender visible slice on scroll (passive listener for performance)
//   viewport.container.addEventListener('scroll', () => {
//     buildVisible();
//   }, { passive: true });

//   return {
//     render,
//     refresh,
//     setActive,
//     applyDiffs,
//     get root() { return gridEl; },
//     set onCellDoubleClick(fn: any) { onCellDoubleClick = fn; },
//     set onCellClick(fn: any) { onCellClick = fn; },
//   } as const;
// }
