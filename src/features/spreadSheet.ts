import type { Cell, Editor } from "../types/cell";
import { createSheet } from "../grid/createSheet";
import { UndoRedo } from "../features/utilities/undoRedocontrols";
import type { CellChange } from "../types/cellchange";
import { FontFamily } from "./utilities/fontFamily";
import { CommonControls } from "./utilities/commonControls";
import { FontWeight } from "./utilities/fontWeight";
import { FontItalic } from "./utilities/fontItalic";

export class SpreadSheet extends HTMLElement {
    rows = 40;
    cols = 40;
    ROWS = 0;
    COLS = 0;
    grid:Cell[][] = createSheet(this.rows, this.cols);
    selectedCell = { row: 0, col: 0 };
    previousCell = {row: 0, col: 0};
    currentCellCopy = this.selectedCell;
    initialWidth: number | undefined = 0;
    currentWidth: number | undefined = 0;
    activeCellElement:HTMLElement | null = null;
    measureCanvas: HTMLCanvasElement = document.createElement('canvas');
    measureCtx = this.measureCanvas.getContext("2d")!;
    lineWidth: number = 0;
    startTyping: boolean = false;
    sheet = document.querySelector('spread-sheet') as SpreadSheet;
    private undoRedo = new UndoRedo(this.sheet);
    private commonControls = new CommonControls();
    private fontFamily = new FontFamily();
    private fontWeight = new FontWeight();
    private fontItalic = new FontItalic();
    private fontStyle = 'normal';
    constructor() {
       super();
       this.ROWS = this.grid.length;
       this.COLS = this.grid[0].length;
       this.tabIndex = 0;
       this.focus();
       this.addEventListener("keydown", this.handleKey.bind(this));
       this.addEventListener("click", this.handleClick.bind(this));
       this.addEventListener("dblclick", this.handleDoubleCLick);
       this.addEventListener("input", this.handleInput);
       this.addEventListener("mousemove", this.move);
    }
    move(e: MouseEvent) {
      //  console.log(e.clientX, e.clientY,"XXYYY")
    }

    connectedCallback() {
       this.renderer();
       this.setActiveCell(this.selectedCell.row, this.selectedCell.col);
       setTimeout(()=>{
         const cells = document.querySelectorAll(".cell");
       },0);
    };    

    handleDoubleCLick (event:MouseEvent):void {
        this.setCellFocus(event);
    }

    callUndo():void {
      console.log("call")
      if(this.grid[this.selectedCell.row][this.selectedCell.col].oldValue === this.grid[this.selectedCell.row][this.selectedCell.col].newValue) return;
      // this.undoRedo.undo({row: this.selectedCell.row, col: this.selectedCell.col});
      let currentCell = this.querySelector(`td[data-r="${this.selectedCell.row}"][data-c="${this.selectedCell.col}"] div`) as HTMLElement;
        if(currentCell){
          let undoValue: CellChange | undefined = this.undoRedo.undo({row: this.selectedCell.row, col: this.selectedCell.col});
          console.log(undoValue,"undo value")
          currentCell.innerText = undoValue?.oldValue ?? "";
        };
    }

    callRedo():void {
      if(this.grid[this.selectedCell.row][this.selectedCell.col].oldValue === this.grid[this.selectedCell.row][this.selectedCell.col].newValue) return;
        let currentCell = this.querySelector(`td[data-r="${this.selectedCell.row}"][data-c="${this.selectedCell.col}"] div`) as HTMLElement;
        if(currentCell){
          let redoValue: CellChange | undefined = this.undoRedo.redo({row: this.selectedCell.row, col: this.selectedCell.col});
          if(redoValue) currentCell.innerText = redoValue?.newValue ?? "";
      };
    }

    setFontFamily(font: string):void {
        const selection = window.getSelection();
        if(!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        const node = range.commonAncestorContainer;
        const text = range.toString();
        const element = node as HTMLElement;
          if(element?.nodeName === 'SPAN') {
            element.style.fontFamily = font;
            range.insertNode(element);
            return;
          }
        const span = document.createElement('span');
        span.style.fontFamily = font;
        const fragment = range.extractContents();
        span.textContent = text;
        range.insertNode(span);
    }

    applyStyleToSelection(styleKey: string, styleValue: string) {
      let textAndStyles:any = [];
      const selRange = this.getSelectionRange();
      console.log(selRange,"srt")
      if(!selRange) return;
      const root = document.getElementById("table-sheet");
      const editor = root?.querySelector(
          `td[data-r="${this.selectedCell.row}"][data-c="${this.selectedCell.col}"] div`
      );

      if (!editor) {
        console.error("Editor not found", this.selectedCell);
        return null;
      }
      const editorText = editor.innerHTML.toString();
      textAndStyles = [{text: editorText, styles: "", selRange: [0, editor.innerHTML.length], startOffset: 0, endOffset: editorText.length}];
      let completeEditor: Editor = this.grid[this.selectedCell.row][this.selectedCell.col].editor;

      let initialRange = 0;
      let endRange = selRange.start;

      if(completeEditor.length == 1) {
         completeEditor[0] = {text:editorText.substring(initialRange, endRange), style: {styleKey: styleValue}, startOffset: 0, endOffset: selRange.start};
         completeEditor.push({text:editorText.substring(selRange.start, selRange.end), style: {styleKey: styleValue}, startOffset: selRange.start, endOffset: selRange.end});
         editorText.substring(selRange.end).length ? completeEditor.push({text:editorText.substring(selRange.end), style: {styleKey: styleValue}, startOffset: selRange.end, endOffset: editorText.length}) : "";
         this.grid[this.selectedCell.row][this.selectedCell.col].editor = [...completeEditor];
         console.log(completeEditor,"fe")
         return;
      } 
      if(completeEditor.length > 1) {
         if(completeEditor[completeEditor.length - 1].endOffset < editorText.length){
            completeEditor[completeEditor.length] = {text:editorText.substring(completeEditor[completeEditor.length - 1].endOffset, editorText.length), style: {styleKey: styleValue}, startOffset: completeEditor[completeEditor.length - 1].endOffset, endOffset: editorText.length};
         };
         let tempEditor = completeEditor;
         tempEditor.forEach((modal: any, index: number)=>{
             if(modal.startOffset === selRange.start && modal.endOffset === selRange.end) {
              
               Object.keys(modal.style).forEach((key)=>{
                  if(modal.style[key] === styleValue) return;
                  else { modal.style[key] = styleValue; return; }
              });
             };
             console.log(modal,'modal')
             if(selRange.start > modal.startOffset && selRange.end < modal.endOffset) {
                  console.log("hiiit")
                  let newModal = {text: editorText.substring(modal.startOffset, selRange.start),style: {...modal.style},startOffset: modal.startOffset, endOffset: selRange.start};
                  completeEditor[index] = newModal;
                  completeEditor.splice(index + 1, 0, {text:editorText.substring(selRange.start, selRange.end), style: {styleKey: styleValue}, startOffset: selRange.start, endOffset: selRange.end});
                  completeEditor.splice(index + 2, 0, {text:editorText.substring(selRange.end, modal.endOffset), style: {styleKey: styleValue}, startOffset: selRange.end, endOffset: modal.endOffset});
                  this.grid[this.selectedCell.row][this.selectedCell.col].editor = [...completeEditor];
                  console.log(completeEditor,"ab")
                  return;
             }
             if(selRange.start == modal.startOffset && selRange.end < modal.endOffset) {
                  console.log(selRange, "slr")
                  let newModal = {text: editorText.substring(selRange.start, selRange.end),style: {...modal.style},startOffset: selRange.start, endOffset: selRange.end};
                  completeEditor[index] = newModal;
                  completeEditor.splice(index + 1, 0, {text:editorText.substring(selRange.end, modal.endOffset), style: {styleKey: styleValue}, startOffset: selRange.end , endOffset: modal.endOffset});
                  this.grid[this.selectedCell.row][this.selectedCell.col].editor = [...completeEditor];
                  console.log(completeEditor,"ab1");
                  return;
             }
             if(selRange.start > modal.startOffset && selRange.end == modal.endOffset) {
                  console.log(selRange,modal, index, "slr")
                  let newModal = {text: editorText.substring(modal.startOffset, selRange.start),style: {...modal.style},startOffset: modal.startOffset, endOffset: selRange.start};
                  completeEditor[index] = newModal;
                  completeEditor.splice(index + 1, 0, {text: editorText.substring(selRange.start, selRange.end),style: {...modal.style},startOffset: selRange.start, endOffset: selRange.end});
                  this.grid[this.selectedCell.row][this.selectedCell.col].editor = [...completeEditor];
                  console.log(completeEditor,"ab1");
                  return;
             }

             if(selRange.start < modal.endOffset && modal.startOffset > selRange.start) {
                  let newModal = {text: modal.text.substring(modal.startOffset, selRange.start),style: {...modal.style},startOffset: modal.startOffset, endOffset: selRange.start};
                  completeEditor[index] = newModal;
             }
         });
      }
      
    }

    getSelectionRange() {
        const selection = window.getSelection();
        if (!selection?.rangeCount) return null;

        const range = selection.getRangeAt(0);
        const root = document.getElementById("table-sheet");
        const editor = root?.querySelector(
          `td[data-r="${this.selectedCell.row}"][data-c="${this.selectedCell.col}"] div`
        );

        if (!editor) {
          console.error("Editor not found", this.selectedCell);
          return null;
        }

        const preStart = range.cloneRange();
        preStart.selectNodeContents(editor);
        preStart.setEnd(range.startContainer, range.startOffset);
        const start = preStart.toString().length;

        const preEnd = range.cloneRange();
        preEnd.selectNodeContents(editor);
        preEnd.setEnd(range.endContainer, range.endOffset);
        const end = preEnd.toString().length;

        return { start, end };
    }

    removeWrapperFromSelection(selector:any) {
      const selection = window.getSelection();
      if (!selection?.rangeCount) return;

      const range = selection.getRangeAt(0);

      let startNode = range.startContainer;

      if (startNode && startNode.nodeType === 3) {
        startNode = startNode.parentNode as Element;
      }
      let wrapper;
      if(startNode instanceof Element) {
      wrapper = startNode.closest(selector);
      if (!wrapper) return;
      }

      const beforeRange = range.cloneRange();
      beforeRange.selectNodeContents(wrapper);
      console.log(range.startOffset,"sta");
      beforeRange.setEnd(range.startContainer, range.startOffset);

      const afterRange = range.cloneRange();
      afterRange.selectNodeContents(wrapper);
      afterRange.setStart(range.endContainer, range.endOffset);

      const beforeFragment = beforeRange.extractContents();
      const selectedFragment = range.extractContents();
      const afterFragment = afterRange.extractContents();

      if (beforeFragment.textContent.trim()) {
        const beforeSpan = wrapper.cloneNode(false);
        beforeSpan.appendChild(beforeFragment);
        wrapper.parentNode.insertBefore(beforeSpan, wrapper);
      }

      wrapper.parentNode.insertBefore(selectedFragment, wrapper);

      if (afterFragment.textContent.trim()) {
        const afterSpan = wrapper.cloneNode(false);
        afterSpan.appendChild(afterFragment);
        wrapper.parentNode.insertBefore(afterSpan, wrapper);
      }

      wrapper.remove();
    }

    setFontItalic():void {
        const selection = document.getSelection();
        if(!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        console.log(range,"r")
        console.log(this.getSelectionRange(),'selr');
        const childElements = range.commonAncestorContainer.childNodes;
        const childSpanElements: ChildNode[] = Array.from(childElements).filter( (el): el is HTMLSpanElement => el instanceof HTMLSpanElement); 
        const childTextElements:any = Array.from(childElements).findIndex((el,index): el is HTMLTextAreaElement=> el.nodeName === '#text');
        
        if(range.startContainer.nextSibling?.nodeName === 'SPAN' || range.startContainer.parentElement?.nodeName === 'SPAN') {
           if(range.commonAncestorContainer.nodeName === 'SPAN') {
              const spanParentEl = range.commonAncestorContainer as HTMLSpanElement;
              if(spanParentEl && spanParentEl.computedStyleMap().get("font-style")?.toString() === 'italic') { 
              spanParentEl.style.fontStyle = "normal";
              } else {
                spanParentEl.style.fontStyle = "italic";
              
              }
              if(childSpanElements.length) {
                childSpanElements.forEach((el)=> {
                  (el as HTMLSpanElement).style.fontStyle = spanParentEl.style.fontStyle;
                });
                childElements.forEach((el)=> {
                  (el as HTMLTextAreaElement).style.fontStyle = spanParentEl.style.fontStyle;
                });
              } 
            } 
           else if(range.startContainer.parentElement?.nodeName === 'SPAN') {
            const span = range.startContainer.parentElement as HTMLElement;
            if(span && span.computedStyleMap().get("font-style")?.toString() === 'italic') {
              span.style.fontStyle = "normal";
            } else {
              span.style.fontStyle = "italic";
              console.log(span)
            }
            if(childSpanElements.length) {
                childSpanElements.forEach((el)=> {
                  (el as HTMLSpanElement).style.fontStyle = 'italic';
                });
              }
          }
             else {
                const spanEl = range.startContainer.parentElement as HTMLElement;
                if(spanEl && spanEl.nodeName === 'SPAN' && spanEl.computedStyleMap().get("font-style")?.toString() === 'italic') {
                spanEl.style.fontStyle = "normal";
              } else if(spanEl && spanEl.nodeName === 'SPAN' && spanEl.computedStyleMap().get("font-style")?.toString() === 'normal'){
                spanEl.style.fontStyle = "italic";
                console.log(spanEl,'ll')
              } else if(childSpanElements.length) {
                childSpanElements.forEach((el)=> {
                  (el as HTMLSpanElement).style.fontStyle = 'italic';
                });
                let span = document.createElement('span');
                    span.style.fontStyle = "italic";
                    const text = range.extractContents();
                    span.appendChild(text);
                    range.deleteContents();
                    range.insertNode(span);
                    selection.removeAllRanges();
                    const newRange = document.createRange();
                    newRange.selectNodeContents(span);
                    selection.addRange(newRange);
                console.log(childSpanElements,"ch")
              } 
        
              else {
               let span = document.createElement('span');
               span.style.fontStyle = "italic";
               const text = range.extractContents();
               span.appendChild(text);
               range.deleteContents();
               range.insertNode(span);
               selection.removeAllRanges();
               const newRange = document.createRange();
               newRange.selectNodeContents(span);
               selection.addRange(newRange);
              }
            }
           } 
          //  else if((range.commonAncestorContainer as HTMLElement).tagName === 'SPAN') {
          //      let spanEl = range.commonAncestorContainer.parentElement as HTMLSpanElement;
          //      if(spanEl && spanEl.computedStyleMap().get("font-style")?.toString() === 'italic') {
          //       spanEl.style.fontStyle = 'normal';
          //      } else if(spanEl && spanEl.computedStyleMap().get("font-style")?.toString() === 'normal'){
          //       spanEl.style.fontStyle = 'italic';
          //      }
          //  } 
           else {
               let span = document.createElement('span');
               span.style.fontStyle = "italic";
               const text = range.toString();
               span.textContent = text;
               range.deleteContents();
               range.insertNode(span);
               selection.removeAllRanges();
               const newRange = document.createRange();
               newRange.selectNodeContents(span);
               selection.addRange(newRange);
            }
    }

    setFontWeight() {
        const selection = document.getSelection();
        if(!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        if(range.startContainer.nextSibling?.nodeName === 'SPAN') {
           const span = range.startContainer.nextSibling as HTMLElement;
           console.log(span.computedStyleMap().get("font-weight")?.toString(),"span")
            if(span && Number(span.computedStyleMap().get("font-weight")?.toString()) === 700) {
              span.style.fontWeight = "normal";
              console.log(span,"here")
              // range.insertNode(span);
            } else {
              span.style.fontWeight = "bold";
              console.log(span)
              // range.insertNode(span);
            }
           } else {
               let span = document.createElement('span');
               span.style.fontWeight = "bold";
               const text = range.toString();
               span.textContent = text;
               range.deleteContents();
               range.insertNode(span);
               selection.removeAllRanges();
               selection.addRange(range);
            }
    }

    updateGrid():void {
      
    }
 
    virtualCellRendering(selectedRow: CellChange): void {
      const virtualCell: HTMLElement | null = this.querySelector(`td[data-r=${selectedRow.row}][data-c="${selectedRow.col}"] div`);
    }

    handleKey(e: KeyboardEvent):void {
      if(e.key === 'Enter' && e.ctrlKey) { 
        this.setNextLine(e);
        this.setNextLine(e);
        return;
      }
      if(e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        this.callUndo();
        // if(this.grid[this.selectedCell.row][this.selectedCell.col].oldValue === this.grid[this.selectedCell.row][this.selectedCell.col].newValue) return;
        // let currentCell = this.querySelector(`td[data-r="${this.selectedCell.row}"][data-c="${this.selectedCell.col}"] div`) as HTMLElement;
        // if(currentCell){
        //   let undoValue: CellChange | undefined = this.undoRedo.undo({row: this.selectedCell.row, col: this.selectedCell.col});
        //   currentCell.innerText = undoValue?.oldValue ?? "";
        // };
      }
      if(e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        this.callRedo();
        // if(this.grid[this.selectedCell.row][this.selectedCell.col].oldValue === this.grid[this.selectedCell.row][this.selectedCell.col].newValue) return;
        // let currentCell = this.querySelector(`td[data-r="${this.selectedCell.row}"][data-c="${this.selectedCell.col}"] div`) as HTMLElement;
        // if(currentCell){
        //   let redoValue: CellChange | undefined = this.undoRedo.redo({row: this.selectedCell.row, col: this.selectedCell.col});
        //   console.log(redoValue,"redovalue");
        //   if(redoValue) currentCell.innerText = redoValue?.newValue ?? "";
        // };
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
       if(!this.grid[row][col].cellActive) {
          this.activeCellElement = cell as HTMLElement;
          console.log(this.grid[this.previousCell.row][this.previousCell.col], "cell123")
          console.log((previousCell.computedStyleMap().get("min-width") as CSSUnitValue).value,cell.getBoundingClientRect(),"precell")
          console.log(this.grid,"setww")
          const currentWidth = previousCell.getBoundingClientRect().width;
          
          this.grid[this.selectedCell.row][this.selectedCell.col].minWidth = currentWidth;
       } else {
          
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
       this.commonControls.setCurrentCell(this.selectedCell);
      //  (previousCell.children[0] as HTMLElement).style.left = "0px";
      //  (previousCell.children[0] as HTMLElement).style.top = "0px";
      //  (previousCell.children[0] as HTMLElement).style.width = "100px";
      
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
       
       const row = Number(td.dataset.r);
       const col = Number(td.dataset.c);
       this.setActiveCell(row, col);
    };

    setCellFocus(event: MouseEvent):void {
        const cell = event.target as HTMLElement;
        console.log(cell.parentElement?.localName,'node name',cell.attributes.getNamedItem('contentEditable'))
        if(!((cell.nodeName === 'DIV') && cell.attributes.getNamedItem('contentEditable'))) return;
        cell.setAttribute("contentEditable", "true");
        cell.style.removeProperty('width');
        this.startTyping = false;
        
        // cell.classList.remove('normal-cell');
        // cell.classList.add('input-cell', 'editable-cell');
        // cell.style.position = "fixed";
        cell.style.left = `${cell.parentElement?.getBoundingClientRect().left!}px`;
        cell.style.top = `${cell.parentElement?.getBoundingClientRect().top! + 2}px`;
        // console.log(this.grid[this.selectedCell.row][this.selectedCell.col].minWidth, "cellrow",this.grid)
        // console.log(this.grid[this.selectedCell.row][this.selectedCell.col].minWidth,"inside width")
        // console.log(this.grid,"gridthis")
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
            // console.log(lineWidth,cell.innerHTML.split('<br>'),"lineww")
            // console.log(currentLineWidth,lineWidth,"currli");
            // console.log(cell.innerHTML)
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

    renderer() {
        console.log("works2")
         this.innerHTML = `
         <div style="width:max-content;overflow-x:auto;">
           <table id="table-sheet" class="table-sheet">
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
                return `<td class="normal-cell cell" style="white-space: nowrap;position: relative; box-sizing: border-box;" data-r="${rIndex}" data-c="${cIndex}">
                <div style="width:100px;white-space: pre-wrap;font-family: ${col.fontFamily};font-size:${col.fontSize};font-weight:${col.bold};" class="edit-cell" role="cell-parent" contentEditable = false>${col.value}</div>
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