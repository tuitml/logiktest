import type { DatenmanipulationResult } from '../../../core/engine';
import type { Preisstand } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/**
 * ARB < 2025 -> undefined
 * ARB = 2025 -> 20251001_ARB2025
 * ARB = 2026 -> 20261001_ARB2026
 * sonst      -> undefined (nicht spezifiziert)
 */
export function preisstandDatenmanipulation(
  ctx: VertragsdatenContext,
): DatenmanipulationResult<Preisstand> {
  switch (ctx.value<number>('arb')) {
    case 2025:
      return '20251001_ARB2025';
    case 2026:
      return '20261001_ARB2026';
    default:
      return undefined;
  }
}
