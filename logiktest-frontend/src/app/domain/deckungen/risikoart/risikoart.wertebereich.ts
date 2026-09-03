import type { Versicherer } from '../../versicherer';
import type { DeckungContext } from '../deckung.context';
import { risikoartOptions } from '../combination';
import { catalogFor, type RisikoartOption } from '../risikoart-catalog';

/**
 * Katalog des aktuellen Versicherers, gefiltert um die Kombinatorik-Regeln
 * (Eindeutigkeit, RA15 allein, Fahrer-RS-Paarung).
 */
export function risikoartWertebereich(ctx: DeckungContext): ReadonlyArray<RisikoartOption> {
  const catalog = catalogFor(ctx.value<Versicherer>('versicherer'));
  return risikoartOptions(catalog, ctx.otherRisikoarten());
}
