import type { SelectOption } from '../../../core/engine';
import { ZAHLUNGSART_LABEL } from '../vertragsdaten.types';
import type { Zahlungsart } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';

export function zahlungsartWertebereich(
  _ctx: VertragsdatenContext,
): ReadonlyArray<SelectOption<Zahlungsart>> {
  return (Object.keys(ZAHLUNGSART_LABEL) as Zahlungsart[]).map((value) => ({
    value,
    label: ZAHLUNGSART_LABEL[value],
  }));
}
