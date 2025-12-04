export function createViewport(mount: HTMLElement, opts: { rowHeight?: number; colWidth?: number } = {}) {
const rowHeight = opts.rowHeight ?? 28;
const colWidth = opts.colWidth ?? 100;


const container = document.createElement('div');
container.className = 'sheet-viewport';
container.style.position = 'relative';
container.style.overflow = 'auto';
container.style.height = '600px';
mount.appendChild(container);


function size() {
return { width: container.clientWidth, height: container.clientHeight, rowHeight, colWidth };
}


function getScroll() {
return { top: container.scrollTop, left: container.scrollLeft };
}


return { container, size, getScroll, rowHeight, colWidth };
}