import type { Lebenssituation } from '../vertragsdaten.typen';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

/** Pflichtfeld, sobald relevant (ARB >= 2026). */
export function lebenssituationValidierung(ctx: VertragsdatenKontext): string[] {
  return ctx.wert<Lebenssituation>('lebenssituation') == null
    ? ['Lebenssituation ist ein Pflichtfeld.']
    : [];
}
