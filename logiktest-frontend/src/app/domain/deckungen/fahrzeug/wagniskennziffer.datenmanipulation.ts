import { BEHALTEN, leeren } from '../../../core/engine';
import type { DatenManipulationErgebnis } from '../../../core/engine';
import type { Wagniskennziffer } from '../deckung.typen';
import type { FahrzeugKontext } from '../deckung.kontext';

/**
 * Risikoart der Deckung ungleich 17/100017 -> undefined.
 * ARB >= 2025 -> undefined.
 */
export function wagniskennzifferDatenmanipulation(
  ctx: FahrzeugKontext,
): DatenManipulationErgebnis<Wagniskennziffer> {
  const ra = ctx.risikoartDerDeckung();
  if (ra !== '17' && ra !== '100017') {
    return leeren();
  }
  const arb = ctx.arb();
  if (arb != null && arb >= 2025) {
    return leeren();
  }
  return BEHALTEN;
}
