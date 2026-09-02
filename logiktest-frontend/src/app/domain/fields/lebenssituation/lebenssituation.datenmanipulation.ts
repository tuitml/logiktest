import { BEHALTEN, leeren } from '../../../core/engine';
import type { DatenManipulationErgebnis } from '../../../core/engine';
import type { Lebenssituation } from '../vertragsdaten.typen';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

/** ARB < 2026 (oder unbekannt) -> undefined. */
export function lebenssituationDatenmanipulation(
  ctx: VertragsdatenKontext,
): DatenManipulationErgebnis<Lebenssituation> {
  const arb = ctx.wert<number>('arb');
  return arb == null || arb < 2026 ? leeren() : BEHALTEN;
}
