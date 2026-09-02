import { leeren, setze } from '../../../core/engine';
import type { DatenManipulationErgebnis } from '../../../core/engine';
import type { Preisstand } from '../vertragsdaten.typen';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

/**
 * ARB < 2025 -> undefined
 * ARB = 2025 -> 20251001_ARB2025
 * ARB = 2026 -> 20261001_ARB2026
 * sonst      -> undefined (nicht spezifiziert)
 */
export function preisstandDatenmanipulation(
  ctx: VertragsdatenKontext,
): DatenManipulationErgebnis<Preisstand> {
  switch (ctx.wert<number>('arb')) {
    case 2025:
      return setze('20251001_ARB2025');
    case 2026:
      return setze('20261001_ARB2026');
    default:
      return leeren();
  }
}
