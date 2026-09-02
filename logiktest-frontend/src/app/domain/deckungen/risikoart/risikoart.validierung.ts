import type { DeckungKontext } from '../deckung.kontext';
import type { RisikoartId } from '../deckung.typen';
import { risikoartWertebereich } from './risikoart.wertebereich';

export function risikoartValidierung(ctx: DeckungKontext): string[] {
  const wert = ctx.risikoartDieserDeckung();
  if (wert == null) {
    return ['Risikoart ist ein Pflichtfeld.'];
  }
  if (!risikoartWertebereich(ctx).some((o: { wert: RisikoartId }) => o.wert === wert)) {
    return ['Diese Risikoart ist in der aktuellen Kombination nicht zulässig.'];
  }
  return [];
}
