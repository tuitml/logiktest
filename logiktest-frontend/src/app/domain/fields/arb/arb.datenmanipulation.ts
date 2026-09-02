import { leeren, setze } from '../../../core/engine';
import type { DatenManipulationErgebnis } from '../../../core/engine';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

/**
 * ARB ist immer eine Jahreszahl, abgeleitet aus dem Tarif:
 *   "20" + 2. und 3. Stelle des Tarifs.
 *   Beispiel: Tarif "N1526" -> ARB 2015.
 * Ohne (verwertbaren) Tarif: undefined.
 */
export function arbDatenmanipulation(ctx: VertragsdatenKontext): DatenManipulationErgebnis<number> {
  const tarif = ctx.wert<string>('tarif');
  const stellen = tarif?.slice(1, 3);
  if (!stellen || !/^\d{2}$/.test(stellen)) {
    return leeren();
  }
  return setze(Number(`20${stellen}`));
}
