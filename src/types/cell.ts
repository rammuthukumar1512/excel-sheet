export type CellValue = string;

export interface Cell {
  value: CellValue;
  oldValue: string;
  newValue: string;
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
