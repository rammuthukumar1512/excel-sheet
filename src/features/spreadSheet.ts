import type { Cell } from "../types/cell";
import { createSheet } from "../grid/createSheet";
import { UndoRedo } from "../features/utilities/undoRedocontrols";
import type { CellChange } from "../types/cellchange";

class SpreadSheet extends HTMLElement {
    rows = 40;
    cols = 40;
    ROWS = 0;
    COLS = 0;
    grid:Cell[][] = [];
    selectedCell = { row: 0, col: 0 };
    previousCell = {row: 0, col: 0};
    currentCellCopy = this.selectedCell
    initialWidth: number | undefined = 0;
    currentWidth: number | undefined = 0;
    activeCellElement:HTMLElement | null = null;
    measureCanvas: HTMLCanvasElement = document.createElement('canvas');
    measureCtx = this.measureCanvas.getContext("2d")!;
    lineWidth: number = 0;
    startTyping: boolean = false;
    private undoRedo = new UndoRedo();
    constructor() {
       super();
       this.grid = createSheet(this.rows, this.cols);
       this.ROWS = this.grid.length;
       this.COLS = this.grid[0].length;
       this.tabIndex = 0;
       this.focus();
       this.addEventListener("keydown", this.handleKey.bind(this));
       this.addEventListener("click", this.handleClick.bind(this));
       this.addEventListener("dblclick", this.handleDoubleCLick);
       this.addEventListener("input", this.handleInput);
       this.addEventListener("mousemove", this.move);
       console.log("init")
    }
    move(e: MouseEvent) {
      //  console.log(e.clientX, e.clientY,"XXYYY")
    }

    handleDoubleCLick (event:MouseEvent):void {
        this.setCellFocus(event);
    }

    handleKey(e: KeyboardEvent):void {
      if(e.key === 'Enter' && e.ctrlKey) { 
        this.setNextLine(e);
        this.setNextLine(e);
        return;
      }
      if(e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        if(this.grid[this.selectedCell.row][this.selectedCell.col].oldValue === this.grid[this.selectedCell.row][this.selectedCell.col].newValue) return;
        let currentCell = this.querySelector(`td[data-r="${this.selectedCell.row}"][data-c="${this.selectedCell.col}"] div`) as HTMLElement;
        if(currentCell){
          let undoValue: CellChange | undefined = this.undoRedo.undo({row: this.selectedCell.row, col: this.selectedCell.col});
          currentCell.innerText = undoValue?.oldValue ?? "";
        };
      }
      if(e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        if(this.grid[this.selectedCell.row][this.selectedCell.col].oldValue === this.grid[this.selectedCell.row][this.selectedCell.col].newValue) return;
        let currentCell = this.querySelector(`td[data-r="${this.selectedCell.row}"][data-c="${this.selectedCell.col}"] div`) as HTMLElement;
        if(currentCell){
          let redoValue: CellChange | undefined = this.undoRedo.redo({row: this.selectedCell.row, col: this.selectedCell.col});
          console.log(redoValue,"redovalue");
          currentCell.innerText = redoValue?.newValue ?? "";
        };
      }
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Tab'].includes(e.key)) {
        e.preventDefault();
        let {row, col} = this.selectedCell;
        switch (e.key) {
            case 'ArrowUp':
               row = Math.max(0, row - 1);
                break;
            case 'ArrowDown':
               row = Math.min(this.ROWS - 1, row + 1);
               break;
            case 'Enter':
               const currentCell = this.querySelector(`td[data-r="${row}"][data-c="${col}"] div`) as HTMLElement;
               if(currentCell.getAttribute('contentEditable') === 'false') {
                   this.setCellFocusWhileEnterButon(currentCell);
                   return;
               }
               row = Math.min(this.ROWS - 1, row + 1);
                break;
            case 'ArrowLeft':
                col = Math.max(0, col - 1);
                break;
            case 'ArrowRight':
            case 'Tab':
                col = Math.min(this.COLS - 1, col + 1);
                break;
            default:
                return;
        }
        this.setActiveCell(row, col);
      }
    };

    setActiveCell(row: number, col: number):void {
      console.log('actcell', row,col)
      this.previousCell = {...this.selectedCell };
      this.lineWidth = this.grid[row][col].lineWidth;
       const previousCell = this.querySelector(`td[data-r="${this.previousCell.row}"][data-c="${this.previousCell.col}"]`) as HTMLElement;
       const cell = this.querySelector(`td[data-r="${row}"][data-c="${col}"]`) as HTMLElement;
       console.log(cell, previousCell,"pc")
       if(!this.grid[row][col].cellActive) {
          this.activeCellElement = cell as HTMLElement;
          console.log(this.grid[this.previousCell.row][this.previousCell.col], "cell123")
          console.log((previousCell.computedStyleMap().get("min-width") as CSSUnitValue).value,cell.getBoundingClientRect(),"precell")
          console.log(this.grid,"setww")
          const currentWidth = previousCell.getBoundingClientRect().width;
          console.log(currentWidth,"currwidth")
          this.grid[this.selectedCell.row][this.selectedCell.col].minWidth = currentWidth;
       } else {
          console.log(this.grid,"gridthis")
       }
       if(cell.children[0].innerHTML.length) {
         this.grid[row][col].cellActive = true;
         this.grid[row][col].value = cell.innerHTML;
       }
          
      //  this.previousCell = {...this.selectedCell };
       this.currentCellCopy = { ...this.selectedCell };
       this.selectedCell = { row: row, col: col };
       previousCell.classList.remove('input-cell', 'editable-cell');
       previousCell.classList.add('normal-cell');
       previousCell.style.position = "relative";
       previousCell.style.removeProperty('min-width');
       this.undoRedo.clearUndoStack();
      //  (previousCell.children[0] as HTMLElement).style.left = "0px";
      //  (previousCell.children[0] as HTMLElement).style.top = "0px";
      //  (previousCell.children[0] as HTMLElement).style.width = "100px";
       console.log(cell,"cells")
       previousCell.children[0].setAttribute("contentEditable", "false");
        if (cell && cell.classList.contains('normal-cell')) {
          cell.classList.remove('normal-cell');
          cell.classList.add('input-cell', 'editable-cell');
          
        }
      this.tabIndex = 0;
      this.focus();  
    }

    handleClick(event: Event):void {
      console.log(event, 'event');
       const td = (event.target as HTMLElement).closest('td');
       if(td?.children[0]?.nodeName !== 'DIV' && !td?.children[0]?.attributes.getNamedItem('contentEditable') ) return;
       console.log(td.children,"child")
       const row = Number(td.dataset.r);
       const col = Number(td.dataset.c);
       this.setActiveCell(row, col);
    };

    setCellFocus(event: MouseEvent):void {
        const cell = event.target as HTMLElement;
        console.log(cell.nodeName,'node name',cell.attributes.getNamedItem('contentEditable'))
        if(!((cell.nodeName === 'DIV') && cell.attributes.getNamedItem('contentEditable'))) return;
        cell.setAttribute("contentEditable", "true");
        cell.style.removeProperty('width');
        this.startTyping = false;
        
        // cell.classList.remove('normal-cell');
        // cell.classList.add('input-cell', 'editable-cell');
        // cell.style.position = "fixed";
        cell.style.left = `${cell.parentElement?.getBoundingClientRect().left!}px`;
        cell.style.top = `${cell.parentElement?.getBoundingClientRect().top! + 2}px`;
        console.log(this.grid[this.selectedCell.row][this.selectedCell.col].minWidth, "cellrow",this.grid)
        console.log(this.grid[this.selectedCell.row][this.selectedCell.col].minWidth,"inside width")
        console.log(this.grid,"gridthis")
        // cell.style.minWidth = `${this.grid[this.selectedCell.row][this.selectedCell.col].minWidth}px`;
        this.grid[this.selectedCell.row][this.selectedCell.col].oldValue = this.grid[this.selectedCell.row][this.selectedCell.col].newValue = cell.innerText;
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(cell);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
    }

    setCellFocusWhileEnterButon(cell: HTMLElement):void {
        cell.children[0].setAttribute("contentEditable", "true");
        cell.classList.remove('normal-cell');
        cell.classList.add('input-cell', 'editable-cell');
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(cell);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
    }

    setNextLine(event: KeyboardEvent | Event):void {
      event.preventDefault();
      const selection = window.getSelection();
      if(!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const br = document.createElement('br');
      range.insertNode(br);
      range.setStartAfter(br);
      range.setEndAfter(br);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }

    handleInput(event: Event):void {
      const cell = event.target as HTMLDivElement;
      const cellDimensions = cell.getBoundingClientRect();
      const left = cellDimensions?.left;
      const getTime = new Date();
      let startTypingTime;
      if(!this.startTyping) {
        this.startTyping = true;
        startTypingTime = getTime.getMilliseconds();
        this.grid[this.selectedCell.row][this.selectedCell.col].startTypingAt = startTypingTime;
      };
      this.grid[this.selectedCell.row][this.selectedCell.col].oldValue = this.grid[this.selectedCell.row][this.selectedCell.col].newValue;
      console.log(this.grid[this.selectedCell.row][this.selectedCell.col].newValue,this.grid[this.selectedCell.row][this.selectedCell.col].oldValue,"no")
      const currentTime = new Date();
      setTimeout(()=>{
       if(startTypingTime! - currentTime.getMilliseconds() <= 2000) {
         this.grid[this.selectedCell.row][this.selectedCell.col].newValue = cell.innerText;
         this.saveEdit();
         this.startTyping = false;
      }
      },2000);
      const width = cell.getBoundingClientRect().width;
      if(cell.innerText.length == 1) {
        this.initialWidth = this.currentWidth = width;
      }
      const maxWidth = document.documentElement.clientWidth - left! + 17;
      cell.style.removeProperty('width');
      if(this.grid[this.selectedCell.row][this.selectedCell.col].lengthFixed) {
        this.setNextLineWhenLengthFixed(cell, event);
      }
      console.log(width, this.currentWidth,"currentwidth")
      // console.log((this.querySelector(`td[data-r="${this.currentCellCopy.row}"][data-c="${this.currentCellCopy.col}"]`) as HTMLElement).CDATA_SECTION_NODE,"nextcell")
      if(width! > this.currentWidth! && !this.grid[this.selectedCell.row][this.selectedCell.col].lengthFixed) {
        this.currentCellCopy = { row: this.currentCellCopy.row, col: this.currentCellCopy.col + 1} ;
      
      const nextCell = this.querySelector(`td[data-r="${this.currentCellCopy.row}"][data-c="${this.currentCellCopy.col}"]`) as HTMLElement;

        this.currentWidth! += nextCell!.getBoundingClientRect().width;
        if(nextCell.getBoundingClientRect().right > window.innerWidth) {
          this.currentWidth! = window.innerWidth - nextCell.getBoundingClientRect().right - 16
          cell.style.minWidth = `${maxWidth - 18}px`;
          const availableWidth = this.getAvailableWidth(cell);
          if(this.grid[this.selectedCell.row][this.selectedCell.col].lineWidth == 0) {
            const fixedWidth = this.grid[this.selectedCell.row][this.selectedCell.col].lineWidth;
            this.grid[this.selectedCell.row][this.selectedCell.col].lineWidth = this.lineWidth = availableWidth;
          }
          this.setNextLineWhenLengthFixed(cell, event);
          this.grid[this.selectedCell.row][this.selectedCell.col].lengthFixed = true;  
          return
        };
        // console.log(nextCell.getBoundingClientRect().right,"current w", cell.parentElement)
        // nextCell.style.position = "absolute";
        // nextCell.style.backgroundColor = "blue";
        cell.parentElement!.style.position = "absolute";
        cell.parentElement!.style.height = "fit-content"
        // cell.style.backgroundColor = "green"
        cell.style.minWidth = `${this.currentWidth}px`;
        cell.parentElement!.style.flex = "1";
        // cell.style.minWidth = `${this.currentWidth}px`;
        cell.style.flex = "1"
        // const br = document.createElement('br');
        // const textNode = document.createTextNode("");
        // cell.append(br);
        // cell.append(textNode);

        // const range = document.createRange();
        // range.setStart(textNode, 0);
        // range.collapse(true);
        // const selection = window.getSelection();
        // selection?.removeAllRanges();
        // selection?.addRange(range);
      }
    }

    getAvailableWidth(cell:HTMLDivElement): number {
       const styles = getComputedStyle(cell);
       const paddingLeft = parseFloat(styles.paddingLeft);
       const paddingRight = parseFloat(styles.paddingRight);
       const availableWidth = cell.clientWidth - paddingRight;
       return availableWidth;
    }

    setNextLineWhenLengthFixed(cell: HTMLElement, event: Event):void {
      const totalLines = cell.innerHTML.split('<br>');
          console.log(totalLines,"tl")
          const lineWidth = this.getLineWidth(cell.innerHTML.split('<br>')[0], "14px Arial");
          // totalLines.forEach((value, index)=> {
            const currentLineWidth = this.getLineWidth(cell.innerHTML.split('<br>')[totalLines.length - 1], "14px Arial");
            console.log(lineWidth,cell.innerHTML.split('<br>'),"lineww")
            console.log(currentLineWidth,lineWidth,"currli");
            console.log(cell.innerHTML)
            if(currentLineWidth >= lineWidth) {
                this.setNextLine(event);
                this.setNextLine(event);
            }               
    }

    saveEdit() {
      this.undoRedo.saveEdit({row: this.selectedCell.row, col: this.selectedCell.col, oldValue: this.grid[this.selectedCell.row][this.selectedCell.col].oldValue, newValue: this.grid[this.selectedCell.row][this.selectedCell.col].newValue});
    }

//   finishEditing() {
//     console.log('finish')
//       const cell = this.activeCellElement;
//       console.log(cell, this.activeCellElement?.parentElement,'asl')
//       if (!cell) return;
//       const r = Number(cell.parentElement?.dataset.r);
//       const c = Number(cell.parentElement?.dataset.c);
//       console.log(r,c,'rc')

//       const newValue = cell.innerText.trim();
//       this.grid[r][c].value = newValue;
//       this.grid[r][c].cellActive = false;
//       this.renderer()
//       cell.setAttribute("contentEditable", 'false');
//       console.log(cell,'afl')
//       this.activeCellElement?.setAttribute("contentEditable", 'false');
//       cell.classList.remove("input-cell", "editable-cell");
//       cell.classList.add("normal-cell");
//       console.log(r,c,'bfrp')
//       this.setActiveCell(r, c);
// }

getLineWidth(text: string, font: string) {
   this.measureCtx!.font = font;
   const width = this.measureCtx.measureText(text).width;
   console.log(width,"widthline")
   return width;
}

    connectedCallback() {
       this.renderer();
       this.setActiveCell(this.selectedCell.row, this.selectedCell.col);
       console.log(this.grid,"grid")
    };    

    renderer() {
        console.log("works2")
         this.innerHTML = `
         <div style="width:max-content;overflow-x:auto;">
           <table class="table-sheet">
              <thead>
              <tr>
              <th class="px-4 thead-padding"></th>
              ${Array.from({length: this.cols}).map((_,hIndex)=> {
                return `<th style="width: 100px;" class="fw-light-2 fs-8">${String.fromCharCode(65 + hIndex)}</th>`
              }).join("")}
              </tr>
              </thead>
              <tbody>
              ${this.grid.map((row, rIndex)=> {
                return `<tr>
                <td class="text-center fw-light-3 fs-8">${rIndex + 1}</td>
                ${row.map((col, cIndex)=> {
                return `<td class="normal-cell" style="white-space: nowrap;position: relative; box-sizing: border-box;" data-r="${rIndex}" data-c="${cIndex}">
                <div style="width:100px;white-space: pre-wrap;" class="edit-cell" role="cell-parent" contentEditable = false>${col.newValue}</div>
                </td>`
                }).join("")}
                </tr>`
              }).join("")}
              </tbody>
           </table>
           </div>        
        ` ;
    }
}

customElements.define('spread-sheet', SpreadSheet);