// src/ui/statusbar.ts
export function createStatusBar(container: HTMLElement) {
  const bar = document.createElement('div');
  bar.className = 'statusbar';
  bar.textContent = 'Ready';
  container.appendChild(bar);
  return {
    setText: (t: string) => { bar.textContent = t; }
  };
}
