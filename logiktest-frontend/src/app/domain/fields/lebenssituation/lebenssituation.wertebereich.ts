import type { SelectOption } from '../../../core/engine';
import { LEBENSSITUATION_LABEL } from '../vertragsdaten.types';
import type { Lebenssituation } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';

export function lebenssituationWertebereich(
  _ctx: VertragsdatenContext,
): ReadonlyArray<SelectOption<Lebenssituation>> {
  return (Object.keys(LEBENSSITUATION_LABEL) as Lebenssituation[]).map((value) => ({
    value,
    label: LEBENSSITUATION_LABEL[value],
  }));
}
