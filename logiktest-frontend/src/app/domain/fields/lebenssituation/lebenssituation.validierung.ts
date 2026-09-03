import type { Lebenssituation } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/** Pflichtfeld, sobald relevant (ARB >= 2026). */
export function lebenssituationValidierung(ctx: VertragsdatenContext): string[] {
  return ctx.value<Lebenssituation>('lebenssituation') == null
    ? ['Lebenssituation ist ein Pflichtfeld.']
    : [];
}
