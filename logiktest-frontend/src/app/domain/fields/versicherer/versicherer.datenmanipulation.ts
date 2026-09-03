import { KEEP } from '../../../core/engine';
import type { DatenmanipulationResult } from '../../../core/engine';
import type { Versicherer } from '../../versicherer';
import type { VertragsdatenContext } from '../vertragsdaten.context';
import { versichererWertebereich } from './versicherer.wertebereich';

/**
 * Standardwert bestimmen:
 *   'vrk'  -> VRK
 *   'huk'  -> HCR
 *   'both' -> HCR
 *
 * Greift nur, wenn der aktuelle Wert nicht (mehr) im erlaubten Bereich liegt.
 * Eine gültige Benutzerauswahl (z. B. HUK24) bleibt also erhalten.
 */
export function versichererDatenmanipulation(
  ctx: VertragsdatenContext,
): DatenmanipulationResult<Versicherer> {
  const allowed = versichererWertebereich(ctx).map((o) => o.value);
  const current = ctx.value<Versicherer>('versicherer');
  if (current != null && allowed.includes(current)) {
    return KEEP;
  }

  switch (ctx.auth.permission()) {
    case 'vrk':
      return 'VRK';
    case 'huk':
    case 'both':
      return 'HCR';
    default:
      return allowed[0];
  }
}
