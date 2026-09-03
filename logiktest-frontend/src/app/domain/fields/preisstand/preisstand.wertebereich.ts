import type { SelectOption } from '../../../core/engine';
import { PREISSTAND_LABEL } from '../vertragsdaten.types';
import type { Preisstand } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';

export function preisstandWertebereich(
  _ctx: VertragsdatenContext,
): ReadonlyArray<SelectOption<Preisstand>> {
  return (Object.keys(PREISSTAND_LABEL) as Preisstand[]).map((value) => ({
    value,
    label: PREISSTAND_LABEL[value],
  }));
}
