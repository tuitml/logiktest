import type { SelectOption } from '../../../core/engine';
import type { Versicherer } from '../../versicherer';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

const LABELS: Record<Versicherer, string> = {
  HCR: 'HCR',
  HUK24: 'HUK24',
  VRK: 'VRK',
};

function option(wert: Versicherer): SelectOption<Versicherer> {
  return { wert, label: LABELS[wert] };
}

/**
 * Wertebereich abhängig von den Rollen im Token:
 *   RBBER_HUK          -> HCR, HUK24
 *   RBBER_VRK          -> VRK
 *   beide Rollen       -> HCR, HUK24, VRK
 */
export function versichererWertebereich(
  ctx: VertragsdatenKontext,
): ReadonlyArray<SelectOption<Versicherer>> {
  const optionen: SelectOption<Versicherer>[] = [];
  if (ctx.auth.hatRolle('RBBER_HUK')) {
    optionen.push(option('HCR'), option('HUK24'));
  }
  if (ctx.auth.hatRolle('RBBER_VRK')) {
    optionen.push(option('VRK'));
  }
  return optionen;
}
