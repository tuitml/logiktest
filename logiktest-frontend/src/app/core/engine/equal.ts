/** Wertevergleich (Primitive + flache Arrays). */
export function equal(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) {
    return true;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((value, i) => equal(value, b[i]));
  }
  return false;
}
