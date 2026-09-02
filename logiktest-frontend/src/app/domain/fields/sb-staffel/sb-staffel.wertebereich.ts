import type { SelectOption } from '../../../core/engine';
import type { SbStaffel } from '../vertragsdaten.typen';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

function option(wert: SbStaffel): SelectOption<SbStaffel> {
  return { wert, label: `${wert} €` };
}

/**
 * Abhängig von ARB:
 *   ARB 2015–2019 -> 150 / 250
 *   sonst         -> 150 / 300
 */
export function sbStaffelWertebereich(
  ctx: VertragsdatenKontext,
): ReadonlyArray<SelectOption<SbStaffel>> {
  const arb = ctx.wert<number>('arb');
  if (arb != null && arb >= 2015 && arb <= 2019) {
    return [option(150), option(250)];
  }
  return [option(150), option(300)];
}
