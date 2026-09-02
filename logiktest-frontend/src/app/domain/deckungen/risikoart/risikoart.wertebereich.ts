import type { Versicherer } from '../../versicherer';
import type { DeckungKontext } from '../deckung.kontext';
import type { RisikoartId } from '../deckung.typen';
import { risikoartOptionen } from '../kombinatorik';
import { katalogFuer, type RisikoartOption } from '../risikoart-katalog';

/**
 * Katalog des aktuellen Versicherers, gefiltert um:
 *   - bereits in anderen Deckungen vergebene Risikoarten
 *   - die Fahrer-RS-Paarungsregel (RA10 -> nur Partner)
 */
export function risikoartWertebereich(ctx: DeckungKontext): ReadonlyArray<RisikoartOption> {
  const katalog = katalogFuer(ctx.wert<Versicherer>('versicherer'));
  return risikoartOptionen(katalog, ctx.andereRisikoarten(), ctx.risikoartDieserDeckung());
}

export function istRisikoartWaehlbar(ctx: DeckungKontext, risikoart: RisikoartId): boolean {
  return risikoartWertebereich(ctx).some((o) => o.wert === risikoart);
}
