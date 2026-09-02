import type { Berufsklasse } from '../vertragsdaten.typen';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

/** Pflichtfeld (nur relevant, wenn sichtbar – das prüft die Engine). */
export function berufsklasseValidierung(ctx: VertragsdatenKontext): string[] {
  return ctx.wert<Berufsklasse>('berufsklasse') == null
    ? ['Berufsklasse ist ein Pflichtfeld.']
    : [];
}
