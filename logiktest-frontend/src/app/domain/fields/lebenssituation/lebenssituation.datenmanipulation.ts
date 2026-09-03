import { KEEP } from '../../../core/engine';
import type { DatenmanipulationResult } from '../../../core/engine';
import type { Lebenssituation } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/** ARB < 2026 (oder unbekannt) -> undefined. */
export function lebenssituationDatenmanipulation(
  ctx: VertragsdatenContext,
): DatenmanipulationResult<Lebenssituation> {
  const arb = ctx.value<number>('arb');
  return arb == null || arb < 2026 ? undefined : KEEP;
}
