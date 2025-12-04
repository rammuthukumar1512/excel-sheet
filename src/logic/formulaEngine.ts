import HyperFormula from 'hyperformula'; // optional — ensure installed if you use it
import type { Cell } from '../types/cell';

type EvalResult = { r: number; c: number; value: any; error?: string };

export class FormulaEngine {
  hfInstance: any | null = null;
  useHyper = false;

  constructor(useHyperformula = true) {
    this.useHyper = useHyperformula;
    if (useHyperformula) {
      try {
        this.hfInstance = HyperFormula.buildEmpty(); // basic instance
      } catch (err) {
        // fallback
        this.hfInstance = null;
        this.useHyper = false;
        // console.warn('Hyperformula not available, falling back to simple evaluator');
      }
    }
  }

  // Very small synchronous parse/eval fallback for demo: evaluates numeric expressions only.
  simpleEvalExpression(expr: string): number | string {
    try {
      // sanitize: allow digits, + - * / () . and spaces only
      if (!/^[0-9+\-*/().\s]+$/.test(expr)) return '#ERR';
      // eslint-disable-next-line no-eval
      const val = eval(expr);
      return Number.isFinite(val) ? val : '#ERR';
    } catch (err) {
      return '#ERR';
    }
  }

  // Evaluate a single cell; if startsWith('=') treat as formula
  evaluateCell(cell: Cell, getCellValue: (r:number,c:number)=>any): EvalResult {
    const { r, c, value, formula } = cell;
    const raw = (formula ?? (typeof value === 'string' && value.startsWith('=') ? value : undefined)) ?? null;
    if (!raw) return { r, c, value };
    const expr = (raw as string).slice(1); // strip leading '='

    if (this.useHyper && this.hfInstance) {
      // Integrate Hyperformula: this is a sketch — in real design we'd create a sheet with values/formulas
      // For Phase 0 we just return placeholder
      return { r, c, value: '#HF' };
    } else {
      const v = this.simpleEvalExpression(expr);
      return { r, c, value: v };
    }
  }

  // Evaluate many cells (incremental: only those dirty). returns results array.
  evaluateMany(cells: Cell[], getCellValue: (r:number,c:number)=>any): EvalResult[] {
    const res: EvalResult[] = [];
    for (const cell of cells) {
      res.push(this.evaluateCell(cell, getCellValue));
    }
    return res;
  }
}
