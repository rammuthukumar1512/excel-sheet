// src/logic/undoRedo.ts
export type Command = {
  id?: string;
  apply: () => void;
  undo: () => void;
  meta?: any;
};

export class UndoRedo {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  private max = 500;

  push(cmd: Command) {
    this.undoStack.push(cmd);
    if (this.undoStack.length > this.max) this.undoStack.shift();
    this.redoStack = [];
    cmd.apply();
  }

  undo() {
    const cmd = this.undoStack.pop();
    if (!cmd) return;
    cmd.undo();
    this.redoStack.push(cmd);
  }

  redo() {
    const cmd = this.redoStack.pop();
    if (!cmd) return;
    cmd.apply();
    this.undoStack.push(cmd);
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }
}
