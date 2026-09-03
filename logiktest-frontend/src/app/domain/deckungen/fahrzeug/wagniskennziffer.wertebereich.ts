import type { SelectOption } from '../../../core/engine';
import { WAGNISKENNZIFFER_LABEL } from '../deckung.types';
import type { Wagniskennziffer } from '../deckung.types';
import type { FahrzeugContext } from '../deckung.context';

export function wagniskennzifferWertebereich(
  _ctx: FahrzeugContext,
): ReadonlyArray<SelectOption<Wagniskennziffer>> {
  return (Object.keys(WAGNISKENNZIFFER_LABEL) as Wagniskennziffer[]).map((value) => ({
    value,
    label: WAGNISKENNZIFFER_LABEL[value],
  }));
}
