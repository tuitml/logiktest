import type { Wagniskennziffer } from '../deckung.typen';
import type { FahrzeugKontext } from '../deckung.kontext';

/** Pflichtfeld, sobald relevant. */
export function wagniskennzifferValidierung(ctx: FahrzeugKontext): string[] {
  return ctx.wert<Wagniskennziffer>('wagniskennziffer') == null
    ? ['Wagniskennziffer ist ein Pflichtfeld.']
    : [];
}
