import type { SelectOption } from '../../../core/engine';
import { WAGNISKENNZIFFER_LABEL } from '../deckung.typen';
import type { Wagniskennziffer } from '../deckung.typen';
import type { FahrzeugKontext } from '../deckung.kontext';

export function wagniskennzifferWertebereich(
  _ctx: FahrzeugKontext,
): ReadonlyArray<SelectOption<Wagniskennziffer>> {
  return (Object.keys(WAGNISKENNZIFFER_LABEL) as Wagniskennziffer[]).map((wert) => ({
    wert,
    label: WAGNISKENNZIFFER_LABEL[wert],
  }));
}
