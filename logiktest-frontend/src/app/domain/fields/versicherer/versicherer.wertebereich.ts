import type { SelectOption } from '../../../core/engine';
import type { Versicherer } from '../../versicherer';
import type { VertragsdatenContext } from '../vertragsdaten.context';

const LABELS: Record<Versicherer, string> = {
  HCR: 'HCR',
  HUK24: 'HUK24',
  VRK: 'VRK',
};

function option(value: Versicherer): SelectOption<Versicherer> {
  return { value, label: LABELS[value] };
}

/**
 * Wertebereich abhängig von der Mandanten-Berechtigung:
 *   'huk'  -> HCR, HUK24
 *   'vrk'  -> VRK
 *   'both' -> HCR, HUK24, VRK
 *   'none' -> keine Auswahl
 */
export function versichererWertebereich(
  ctx: VertragsdatenContext,
): ReadonlyArray<SelectOption<Versicherer>> {
  switch (ctx.auth.permission()) {
    case 'huk':
      return [option('HCR'), option('HUK24')];
    case 'vrk':
      return [option('VRK')];
    case 'both':
      return [option('HCR'), option('HUK24'), option('VRK')];
    default:
      return [];
  }
}
