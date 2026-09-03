import { KEEP } from '../../../core/engine';
import type { DatenmanipulationResult } from '../../../core/engine';
import type { SbStaffel } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';
import { sbStaffelWertebereich } from './sb-staffel.wertebereich';

/**
 * Wenn der aktuelle Wert nach einem ARB-Wechsel nicht mehr im Wertebereich liegt,
 * wird das Feld auf undefined gesetzt.
 */
export function sbStaffelDatenmanipulation(
  ctx: VertragsdatenContext,
): DatenmanipulationResult<SbStaffel> {
  const value = ctx.value<SbStaffel>('sbStaffel');
  if (value == null) {
    return KEEP;
  }
  const allowed = sbStaffelWertebereich(ctx).some((o) => o.value === value);
  return allowed ? KEEP : undefined;
}
