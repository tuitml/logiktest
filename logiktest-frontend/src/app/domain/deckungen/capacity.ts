import type { RisikoartId } from './deckung.types';

export type CapacityKind = 'none' | 'required';

export interface DeckungCapacity {
  /** Können / müssen Fahrzeuge erfasst werden? */
  readonly fahrzeuge: CapacityKind;
  /** Können / müssen Grundstücke erfasst werden? */
  readonly grundstuecke: CapacityKind;
}

const FAHRZEUG_RISIKOARTEN: ReadonlySet<RisikoartId> = new Set(['17', '100017']);
const GRUNDSTUECK_RISIKOARTEN: ReadonlySet<RisikoartId> = new Set(['24', '25', '600024', '400025']);

/**
 * Die Risikoart bestimmt, ob eine Deckung Fahrzeuge und/oder Grundstücke hat.
 * In den aktuellen Regeln ist beides jeweils "Pflicht ab 1" oder "gar nicht".
 */
export function capacity(risikoart: RisikoartId | undefined): DeckungCapacity {
  return {
    fahrzeuge: risikoart != null && FAHRZEUG_RISIKOARTEN.has(risikoart) ? 'required' : 'none',
    grundstuecke:
      risikoart != null && GRUNDSTUECK_RISIKOARTEN.has(risikoart) ? 'required' : 'none',
  };
}
