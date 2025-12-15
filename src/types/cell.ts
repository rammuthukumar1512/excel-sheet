export type CellValue = string | number | null;

export interface Cell {
  value: CellValue;
  oldValue: string;
  newValue: string;
  cellActive: boolean;
  minWidth?: CSSStyleValue | undefined;
  lineWidth: number;
  lengthFixed: boolean; 
  startTypingAt: number;
}
