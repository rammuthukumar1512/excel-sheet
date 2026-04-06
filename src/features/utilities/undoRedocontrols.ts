import type { CellChange } from "../../types/cellchange";
import { SpreadSheet } from "../spreadSheet";

export class UndoRedo extends HTMLElement {
      undoStack:CellChange[] = [];
      redoStack:CellChange[] = [];
      undoCount: number = 0;
      redoCount: number = 1;
      previousValue: CellChange = {};
      currentCell: CellChange = {};
      private spreadSheet: SpreadSheet;

      constructor(sheet: SpreadSheet) {
        super();
        this.spreadSheet = sheet;
        document.getElementById("undo")?.addEventListener("click", ()=> this.callUndo());
        document.getElementById("redo")?.addEventListener("click", ()=> this.callRedo());
      }

      connectedCallback() {
         this.renderer();
      }

      callUndo (){
         this.spreadSheet.callUndo();
      }
      callRedo (){
         this.spreadSheet.callRedo();
      }

      saveEdit(currentValue: CellChange) {
        this.undoStack.push(currentValue)
      }

      undo(currentCell: CellChange): CellChange | undefined {
             console.log(this.undoStack,this.undoCount,'redo')
             if(this.undoStack.length === this.undoCount) return this.previousValue;
             this.undoCount++;
            let activeCell = this.undoStack[this.undoStack.length - this.undoCount];
            // this.redoCount = this.undoCount;
            // if(this.undoCount < this.undoStack.length) {
            //       this.undoCount++;
            // }
            if(activeCell.row === currentCell.row && activeCell.col === currentCell.col) {
                  let currentValue = {oldValue: activeCell.oldValue, newValue: activeCell.newValue};
                  this.redoStack.push(activeCell);
                  console.log(this.redoStack,"redoinio")
                  // let newValue = activeCell.newValue;
                  // activeCell = { oldValue: activeCell.newValue, newValue: }
                  this.previousValue = currentValue;
                  return currentValue;
            };
      }

      redo(currentCell: CellChange): CellChange | undefined {
            console.log(!this.redoStack.length,'redostack')
            if(!this.redoStack.length || !this.undoCount) return this.previousValue;
            
            console.log(this.undoStack,this.undoCount,'redo');
            let activeCell = this.undoStack[this.undoStack.length - this.undoCount];
            this.undoCount--;
            // this.redoStack.splice(this.redoStack.length - this.redoCount,1);
            //  if(this.redoCount < this.redoStack.length) {
            //       this.redoCount++;
            //       this.undoCount--;
            //  }
            if(activeCell.row === currentCell.row && activeCell.col === currentCell.col) {
                  let currentValue = { oldValue: activeCell.oldValue, newValue: activeCell.newValue };
                  // this.redoStack.push(currentValue);
                  // let newValue = activeCell.newValue;
                  // activeCell = {oldValue: activeCell.newValue, newValue: }
                  this.previousValue = currentValue;
                  return currentValue;
            };
      }

      clearUndoStack() {
            this.undoStack = [];
            this.undoCount = 1;
      }

      renderer() {
            this.innerHTML = `
             <button id="undo"><i class="fa-solid fa-rotate-left"></i></button>
             &nbsp;
             <button id="redo"><i class="fa-solid fa-rotate-right"></i></button>
            `;
      }
}

customElements.define('undo-redo', UndoRedo)