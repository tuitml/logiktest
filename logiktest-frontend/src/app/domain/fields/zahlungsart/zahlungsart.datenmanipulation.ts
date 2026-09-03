import { KEEP } from '../../../core/engine';
import type { DatenmanipulationResult } from '../../../core/engine';
import type { Zahlungsart } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/** ARB < 2025 (oder unbekannt) -> undefined. */
export function zahlungsartDatenmanipulation(
  ctx: VertragsdatenContext,
): DatenmanipulationResult<Zahlungsart> {
  const arb = ctx.value<number>('arb');
  return arb == null || arb < 2025 ? undefined : KEEP;
}
