import type { Preisstand } from '../vertragsdaten.typen';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

/** Pflichtfeld, sobald relevant (ARB >= 2025). */
export function preisstandValidierung(ctx: VertragsdatenKontext): string[] {
  return ctx.wert<Preisstand>('preisstand') == null ? ['Preisstand fehlt.'] : [];
}
