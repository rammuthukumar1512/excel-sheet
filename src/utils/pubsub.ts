// src/utils/pubsub.ts
type Handler = (payload?: any) => void;

export class PubSub {
  private map = new Map<string, Set<Handler>>();

  on(event: string, handler: Handler) {
    if (!this.map.has(event)) this.map.set(event, new Set());
    this.map.get(event)!.add(handler);
    return () => this.map.get(event)!.delete(handler);
  }

  emit(event: string, payload?: any) {
    const set = this.map.get(event);
    if (!set) return;
    for (const h of Array.from(set)) h(payload);
  }

  off(event: string, handler: Handler) {
    this.map.get(event)?.delete(handler);
  }

  clear() { this.map.clear(); }
}
