// src/ui/toolbar.ts
export function createToolbar(container: HTMLElement) {
  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';

  const addRowBtn = document.createElement('button');
  addRowBtn.textContent = 'Add row';
  addRowBtn.id = 'btn-add-row';

  const addColBtn = document.createElement('button');
  addColBtn.textContent = 'Add col';
  addColBtn.id = 'btn-add-col';

  toolbar.appendChild(addRowBtn);
  toolbar.appendChild(addColBtn);

  container.appendChild(toolbar);

  return { toolbar, addRowBtn, addColBtn };
}
