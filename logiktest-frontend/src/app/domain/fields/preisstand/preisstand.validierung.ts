import type { Preisstand } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/** Pflichtfeld, sobald relevant (ARB >= 2025). */
export function preisstandValidierung(ctx: VertragsdatenContext): string[] {
  return ctx.value<Preisstand>('preisstand') == null ? ['Preisstand fehlt.'] : [];
}
