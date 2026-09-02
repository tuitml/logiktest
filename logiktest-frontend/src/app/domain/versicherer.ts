/** Von mehreren Stellen (Vertragsdaten + Deckungen) genutzt. */
export type Versicherer = 'HCR' | 'HUK24' | 'VRK';

export const ALLE_VERSICHERER: ReadonlyArray<Versicherer> = ['HCR', 'HUK24', 'VRK'];
