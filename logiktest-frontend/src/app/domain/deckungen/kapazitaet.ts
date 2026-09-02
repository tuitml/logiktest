import type { RisikoartId } from './deckung.typen';

export type KapazitaetsArt = 'keine' | 'pflicht';

export interface DeckungsKapazitaet {
  /** Können / müssen Fahrzeuge erfasst werden? */
  readonly fahrzeuge: KapazitaetsArt;
  /** Können / müssen Grundstücke erfasst werden? */
  readonly grundstuecke: KapazitaetsArt;
}

const FAHRZEUG_RISIKOARTEN: ReadonlySet<RisikoartId> = new Set(['17', '100017']);
const GRUNDSTUECK_RISIKOARTEN: ReadonlySet<RisikoartId> = new Set([
  '24',
  '25',
  '600024',
  '400025',
]);

/**
 * Die Risikoart bestimmt, ob eine Deckung Fahrzeuge und/oder Grundstücke hat.
 * In den aktuellen Regeln ist beides jeweils "Pflicht ab 1" oder "gar nicht".
 */
export function kapazitaet(risikoart: RisikoartId | undefined): DeckungsKapazitaet {
  return {
    fahrzeuge: risikoart != null && FAHRZEUG_RISIKOARTEN.has(risikoart) ? 'pflicht' : 'keine',
    grundstuecke:
      risikoart != null && GRUNDSTUECK_RISIKOARTEN.has(risikoart) ? 'pflicht' : 'keine',
  };
}
