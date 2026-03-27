import type { Cell }  from "../types/cell";

export function createSheet(rows:number, cols: number): Cell[][] {
    return Array.from({length: rows}, ()=> Array.from({length: cols}, ()=> ({ value: "", editor: [{text:"", style: {style: ""}, startOffset: 0, endOffset: 0}],oldValue: "",newValue: "", selRanges:[], cellActive: false, minWidth: 100,
        lineWidth: 0, lengthFixed: false,startTypingAt: 0, fontFamily: "Arial", fontSize: 12, bold: false, italic: true, color: "#000000", underline: false
    })))
};