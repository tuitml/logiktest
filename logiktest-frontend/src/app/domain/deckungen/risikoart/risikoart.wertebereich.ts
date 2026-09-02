import type { Versicherer } from '../../versicherer';
import type { DeckungKontext } from '../deckung.kontext';
import type { RisikoartId } from '../deckung.typen';
import { risikoartOptionen } from '../kombinatorik';
import { katalogFuer, type RisikoartOption } from '../risikoart-katalog';

/**
 * Katalog des aktuellen Versicherers, gefiltert um die Kombinatorik-Regeln
 * (Eindeutigkeit, RA15 allein, Fahrer-RS-Paarung).
 */
export function risikoartWertebereich(ctx: DeckungKontext): ReadonlyArray<RisikoartOption> {
  const katalog = katalogFuer(ctx.wert<Versicherer>('versicherer'));
  return risikoartOptionen(katalog, ctx.andereRisikoarten());
}

export function istRisikoartWaehlbar(ctx: DeckungKontext, risikoart: RisikoartId): boolean {
  return risikoartWertebereich(ctx).some((o) => o.wert === risikoart);
}
