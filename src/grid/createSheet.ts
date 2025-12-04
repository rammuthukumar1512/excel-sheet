import type { Cell }  from "../types/cell";

export function createSheet(rows:number, cols: number): Cell[][] {
    return Array.from({length: rows}, ()=> Array.from({length: cols}, ()=> ({ value: "", cellActive: false, minWidth: 100,
        lineWidth: 0, lengthFixed: false
     })))
};