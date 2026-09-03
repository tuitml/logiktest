import type { DatenmanipulationResult } from '../../../core/engine';
import type { Tarifgruppe } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/**
 * Abhängig vom ersten Buchstaben des Tarifs:
 *   N -> Nicht öffentlicher Dienst
 *   B -> Öffentlicher Dienst
 *   S -> Selbstständig
 */
export function tarifgruppeDatenmanipulation(
  ctx: VertragsdatenContext,
): DatenmanipulationResult<Tarifgruppe> {
  switch (ctx.value<string>('tarif')?.[0]) {
    case 'N':
      return 'NICHT_OED';
    case 'B':
      return 'OED';
    case 'S':
      return 'SELBSTSTAENDIG';
    default:
      return undefined;
  }
}
