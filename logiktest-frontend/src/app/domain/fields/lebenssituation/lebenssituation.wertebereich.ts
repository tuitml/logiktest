import type { SelectOption } from '../../../core/engine';
import { LEBENSSITUATION_LABEL } from '../vertragsdaten.typen';
import type { Lebenssituation } from '../vertragsdaten.typen';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

export function lebenssituationWertebereich(
  _ctx: VertragsdatenKontext,
): ReadonlyArray<SelectOption<Lebenssituation>> {
  return (Object.keys(LEBENSSITUATION_LABEL) as Lebenssituation[]).map((wert) => ({
    wert,
    label: LEBENSSITUATION_LABEL[wert],
  }));
}
