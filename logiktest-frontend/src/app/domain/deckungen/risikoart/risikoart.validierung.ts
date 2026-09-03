import type { DeckungContext } from '../deckung.context';
import { risikoartWertebereich } from './risikoart.wertebereich';

export function risikoartValidierung(ctx: DeckungContext): string[] {
  const value = ctx.ownRisikoart();
  if (value == null) {
    return ['Risikoart ist ein Pflichtfeld.'];
  }
  if (!risikoartWertebereich(ctx).some((o) => o.value === value)) {
    return ['Diese Risikoart ist in der aktuellen Kombination nicht zulässig.'];
  }
  return [];
}
