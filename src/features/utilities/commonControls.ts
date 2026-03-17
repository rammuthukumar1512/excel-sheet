import type { CellChange } from "../../types/cellchange";

export class CommonControls {
    currentCell: CellChange = {};
    cells:any;
    grid: CellChange[][] = [];

    constructor() {}
    
    setCells(cells: any) {
      this.cells = cells;
    }

    getCells():any {
      return this.cells;
    }

    setCurrentCell(currentCell: CellChange):void {
         this.currentCell = currentCell;
    }

    getCurrentCell(): CellChange {
        return this.currentCell;
    } 

}