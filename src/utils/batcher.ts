// src/utils/batcher.ts
let scheduled = false;
const queue: (()=>void)[] = [];
export function schedule(fn: ()=>void) {
  queue.push(fn);
  if (!scheduled) {
    scheduled = true;
    Promise.resolve().then(()=> {
      while(queue.length) queue.shift()!();
      scheduled = false;
    });
  }
}
