import type { Zahlungsart } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/** Pflichtfeld, sobald relevant (ARB >= 2025). */
export function zahlungsartValidierung(ctx: VertragsdatenContext): string[] {
  return ctx.value<Zahlungsart>('zahlungsart') == null
    ? ['Zahlungsart ist ein Pflichtfeld.']
    : [];
}
