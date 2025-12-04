export function colToLetter(col: number) {
  let s = "";
  let c = col + 1;
  while (c > 0) {
    const m = (c - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    c = Math.floor((c - 1) / 26);
  }
  return s;
}
export function toA1(r: number, c: number) {
  return `${colToLetter(c)}${r + 1}`;
}
