import type { CellChange } from "../../types/cellchange";

export class UndoRedo extends HTMLElement {
      undoStack:CellChange[] = [];
      redoStack:CellChange[] = [];
      undoCount: number = 1;
      redoCount: number = 1;

      connectedCallback() {
         this.renderer();
      }

      saveEdit(currentValue: CellChange) {
        console.log(currentValue,"cvalue")
        this.undoStack.push(currentValue)
        console.log(this.undoStack,"undostack")
      }

      renderer() {
            this.innerHTML = `
             <button onclick="undo()"><i class="fa-solid fa-rotate-left"></i></button>
            `;
      }

      undo(currentCell: CellChange): CellChange | undefined {
            let activeCell = this.undoStack[this.undoStack.length - this.undoCount];
            console.log(activeCell,"actcell")
            this.redoCount = this.undoCount;
            if(this.undoCount < this.undoStack.length) this.undoCount++;
            if(activeCell.row === currentCell.row && activeCell.col === currentCell.col) {
                  let currentValue = {oldValue: activeCell.oldValue, newValue: activeCell.newValue};
                  this.redoStack.push(activeCell);
                  // let newValue = activeCell.newValue;
                  // activeCell = {oldValue: activeCell.newValue, newValue: }
                  return currentValue;
            };
      }

      redo(currentCell: CellChange): CellChange | undefined {
            let activeCell = this.redoStack[this.redoStack.length - this.redoCount];
            console.log(activeCell,"actcell")
             if(this.redoCount < this.redoStack.length) {
                  this.redoCount++;
                  this.undoCount--;
             }
            if(activeCell.row === currentCell.row && activeCell.col === currentCell.col) {
                  let currentValue = { oldValue: activeCell.oldValue, newValue: activeCell.newValue };
                  // this.redoStack.push(currentValue);
                  // let newValue = activeCell.newValue;
                  // activeCell = {oldValue: activeCell.newValue, newValue: }
                  return currentValue;
            };
      }

      clearUndoStack() {
            this.undoStack = [];
            this.undoCount = 1;
      }
}

customElements.define('undo-redo', UndoRedo)