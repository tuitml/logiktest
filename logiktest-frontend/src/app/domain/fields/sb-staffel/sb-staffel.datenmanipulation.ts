import { BEHALTEN, leeren } from '../../../core/engine';
import type { DatenManipulationErgebnis } from '../../../core/engine';
import type { SbStaffel } from '../vertragsdaten.typen';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';
import { sbStaffelWertebereich } from './sb-staffel.wertebereich';

/**
 * Wenn der aktuelle Wert nach einem ARB-Wechsel nicht mehr im Wertebereich liegt,
 * wird das Feld auf undefined gesetzt.
 */
export function sbStaffelDatenmanipulation(
  ctx: VertragsdatenKontext,
): DatenManipulationErgebnis<SbStaffel> {
  const wert = ctx.wert<SbStaffel>('sbStaffel');
  if (wert == null) {
    return BEHALTEN;
  }
  const erlaubt = sbStaffelWertebereich(ctx).some((o) => o.wert === wert);
  return erlaubt ? BEHALTEN : leeren();
}
