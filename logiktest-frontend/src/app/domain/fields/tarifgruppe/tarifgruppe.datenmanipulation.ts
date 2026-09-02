import { leeren, setze } from '../../../core/engine';
import type { DatenManipulationErgebnis } from '../../../core/engine';
import type { Tarifgruppe } from '../vertragsdaten.typen';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

/**
 * Abhängig vom ersten Buchstaben des Tarifs:
 *   N -> Nicht öffentlicher Dienst
 *   B -> Öffentlicher Dienst
 *   S -> Selbstständig
 */
export function tarifgruppeDatenmanipulation(
  ctx: VertragsdatenKontext,
): DatenManipulationErgebnis<Tarifgruppe> {
  switch (ctx.wert<string>('tarif')?.[0]) {
    case 'N':
      return setze('NICHT_OED');
    case 'B':
      return setze('OED');
    case 'S':
      return setze('SELBSTSTAENDIG');
    default:
      return leeren();
  }
}
