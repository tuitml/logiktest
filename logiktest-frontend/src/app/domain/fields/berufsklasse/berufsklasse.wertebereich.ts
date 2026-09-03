import type { SelectOption } from '../../../core/engine';
import { BERUFSKLASSE_LABEL } from '../vertragsdaten.types';
import type { Berufsklasse } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';

export function berufsklasseWertebereich(
  _ctx: VertragsdatenContext,
): ReadonlyArray<SelectOption<Berufsklasse>> {
  return [
    { value: 'KEINE', label: BERUFSKLASSE_LABEL.KEINE },
    {
      value: 'MITARBEITER_SOZIALE_EINRICHTUNGEN',
      label: BERUFSKLASSE_LABEL.MITARBEITER_SOZIALE_EINRICHTUNGEN,
    },
  ];
}
