import type { Berufsklasse } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/** Pflichtfeld (nur relevant, wenn sichtbar – das prüft die Engine). */
export function berufsklasseValidierung(ctx: VertragsdatenContext): string[] {
  return ctx.value<Berufsklasse>('berufsklasse') == null
    ? ['Berufsklasse ist ein Pflichtfeld.']
    : [];
}
