import type { Wagniskennziffer } from '../deckung.types';
import type { FahrzeugContext } from '../deckung.context';

/** Pflichtfeld, sobald relevant. */
export function wagniskennzifferValidierung(ctx: FahrzeugContext): string[] {
  return ctx.value<Wagniskennziffer>('wagniskennziffer') == null
    ? ['Wagniskennziffer ist ein Pflichtfeld.']
    : [];
}
