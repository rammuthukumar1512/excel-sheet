// src/logic/selectionManager.ts
import type { Cell } from '../types/cell';
import { PubSub } from '../utils/pubsub';

export type Range = { r1: number; c1: number; r2: number; c2: number; };

function normalizeRange(r1:number,c1:number,r2:number,c2:number): Range {
  return {
    r1: Math.min(r1,r2),
    c1: Math.min(c1,c2),
    r2: Math.max(r1,r2),
    c2: Math.max(c1,c2),
  };
}

export class SelectionManager {
  active: { r:number; c:number } | null = null;
  range: Range | null = null;
  events = new PubSub();

  setActive(r:number,c:number) {
    this.active = { r,c };
    this.range = normalizeRange(r,c,r,c);
    this.events.emit('change', { active: this.active, range: this.range });
  }

  setRange(r1:number,c1:number,r2:number,c2:number) {
    this.range = normalizeRange(r1,c1,r2,c2);
    this.active = { r: r1, c: c1 };
    this.events.emit('change', { active: this.active, range: this.range });
  }

  expandTo(r:number,c:number) {
    if (!this.active) { this.setActive(r,c); return; }
    const { r:ar, c:ac } = this.active;
    this.setRange(ar,ac,r,c);
  }

  clear() {
    this.active = null;
    this.range = null;
    this.events.emit('change', { active: null, range: null });
  }

  onChange(cb: (payload:any)=>void) { return this.events.on('change', cb); }
}
