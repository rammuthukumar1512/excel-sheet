export type CellValue = string | number | null;

export interface Cell {
  value: CellValue;
  cellActive: boolean;
  minWidth?: CSSStyleValue | undefined;
  lineWidth: number;
  lengthFixed: boolean; 
}
