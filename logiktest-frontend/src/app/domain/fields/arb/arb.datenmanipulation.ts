import type { DatenmanipulationResult } from '../../../core/engine';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/**
 * ARB ist immer eine Jahreszahl, abgeleitet aus dem Tarif:
 *   "20" + 2. und 3. Stelle des Tarifs.
 *   Beispiel: Tarif "N1526" -> ARB 2015.
 * Ohne (verwertbaren) Tarif: undefined.
 */
export function arbDatenmanipulation(ctx: VertragsdatenContext): DatenmanipulationResult<number> {
  const tarif = ctx.value<string>('tarif');
  const digits = tarif?.slice(1, 3);
  if (!digits || !/^\d{2}$/.test(digits)) {
    return undefined;
  }
  return Number(`20${digits}`);
}
