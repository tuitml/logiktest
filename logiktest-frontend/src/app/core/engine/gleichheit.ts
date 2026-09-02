/** Wertevergleich für Rohwerte (Primitive + flache Arrays). */
export function gleich(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) {
    return true;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((wert, i) => gleich(wert, b[i]));
  }
  return false;
}
