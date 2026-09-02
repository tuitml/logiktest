import { BEHALTEN, setze } from '../../../core/engine';
import type { DatenManipulationErgebnis } from '../../../core/engine';
import type { Versicherer } from '../../versicherer';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';
import { versichererWertebereich } from './versicherer.wertebereich';

/**
 * Standardwert bestimmen:
 *   nur RBBER_HUK -> HCR
 *   nur RBBER_VRK -> VRK
 *   beide         -> HCR
 *
 * Greift nur, wenn der aktuelle Wert nicht (mehr) im erlaubten Bereich liegt.
 * Eine gültige Benutzerauswahl (z. B. HUK24) bleibt also erhalten.
 */
export function versichererDatenmanipulation(
  ctx: VertragsdatenKontext,
): DatenManipulationErgebnis<Versicherer> {
  const erlaubt = versichererWertebereich(ctx).map((o) => o.wert);
  const aktuell = ctx.wert<Versicherer>('versicherer');
  if (aktuell != null && erlaubt.includes(aktuell)) {
    return BEHALTEN;
  }

  if (ctx.auth.hatNurRolle('RBBER_VRK')) {
    return setze('VRK');
  }
  if (ctx.auth.hatNurRolle('RBBER_HUK')) {
    return setze('HCR');
  }
  if (ctx.auth.hatAlleRollen('RBBER_HUK', 'RBBER_VRK')) {
    return setze('HCR');
  }
  return setze(erlaubt[0]);
}
