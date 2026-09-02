import type { SbStaffel } from '../vertragsdaten.typen';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

/** Pflichtfeld. */
export function sbStaffelValidierung(ctx: VertragsdatenKontext): string[] {
  return ctx.wert<SbStaffel>('sbStaffel') == null
    ? ['Selbstbeteiligung ist ein Pflichtfeld.']
    : [];
}
