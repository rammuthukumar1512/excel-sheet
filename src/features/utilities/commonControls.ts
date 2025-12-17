import type { CellChange } from "../../types/cellchange";

export class CommonControls {
    currentCell: CellChange = {};

    setCurrentCell(currentCell: CellChange):void {
         this.currentCell = currentCell;
    }

    getCurrentCell(): CellChange {
        return this.currentCell;
    } 

}