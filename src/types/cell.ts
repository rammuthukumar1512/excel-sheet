export type CellValue = string;
export type Styles = {styles: {}, startOffset: number, endOffset: number}[];
export type Editor = {text: string, style: { [key: string]: string }, subStyles: Styles, startOffset: number, endOffset: number}[];


export interface Cell {
  value: CellValue;
  editor: Editor;
  oldValue: string;
  newValue: string;
  selRanges: object[];
  cellActive: boolean;
  minWidth?: CSSStyleValue | undefined;
  lineWidth: number;
  lengthFixed: boolean; 
  startTypingAt: number;
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  color: string;
  underline: boolean;
}
