import { KEEP } from '../../../core/engine';
import type { DatenmanipulationResult } from '../../../core/engine';
import type { Wagniskennziffer } from '../deckung.types';
import type { FahrzeugContext } from '../deckung.context';

/**
 * Risikoart der Deckung ungleich 17/100017 -> undefined.
 * ARB >= 2025 -> undefined.
 */
export function wagniskennzifferDatenmanipulation(
  ctx: FahrzeugContext,
): DatenmanipulationResult<Wagniskennziffer> {
  const ra = ctx.deckungRisikoart();
  if (ra !== '17' && ra !== '100017') {
    return undefined;
  }
  const arb = ctx.arb();
  if (arb != null && arb >= 2025) {
    return undefined;
  }
  return KEEP;
}
