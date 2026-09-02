import type { SelectOption } from '../../../core/engine';
import { PREISSTAND_LABEL } from '../vertragsdaten.typen';
import type { Preisstand } from '../vertragsdaten.typen';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

export function preisstandWertebereich(
  _ctx: VertragsdatenKontext,
): ReadonlyArray<SelectOption<Preisstand>> {
  return (Object.keys(PREISSTAND_LABEL) as Preisstand[]).map((wert) => ({
    wert,
    label: PREISSTAND_LABEL[wert],
  }));
}
