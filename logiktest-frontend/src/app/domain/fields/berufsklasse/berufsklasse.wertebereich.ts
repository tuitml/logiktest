import type { SelectOption } from '../../../core/engine';
import { BERUFSKLASSE_LABEL } from '../vertragsdaten.typen';
import type { Berufsklasse } from '../vertragsdaten.typen';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

export function berufsklasseWertebereich(
  _ctx: VertragsdatenKontext,
): ReadonlyArray<SelectOption<Berufsklasse>> {
  return [
    { wert: 'KEINE', label: BERUFSKLASSE_LABEL.KEINE },
    {
      wert: 'MITARBEITER_SOZIALE_EINRICHTUNGEN',
      label: BERUFSKLASSE_LABEL.MITARBEITER_SOZIALE_EINRICHTUNGEN,
    },
  ];
}
