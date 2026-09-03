import type { SelectOption } from '../../../core/engine';
import type { SbStaffel } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';

function option(value: SbStaffel): SelectOption<SbStaffel> {
  return { value, label: `${value} €` };
}

/**
 * Abhängig von ARB:
 *   ARB 2015–2019 -> 150 / 250
 *   sonst         -> 150 / 300
 */
export function sbStaffelWertebereich(
  ctx: VertragsdatenContext,
): ReadonlyArray<SelectOption<SbStaffel>> {
  const arb = ctx.value<number>('arb');
  if (arb != null && arb >= 2015 && arb <= 2019) {
    return [option(150), option(250)];
  }
  return [option(150), option(300)];
}
