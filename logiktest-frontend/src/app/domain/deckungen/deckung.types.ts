/** Typen rund um Deckungen. "Risikoart" ist technisch die ID einer Deckung,
 *  wird aber als eigenständiges Feld behandelt. */

export type RisikoartId = string;

export type Wagniskennziffer =
  | 'KRAFTRAEDER_MIT_ZULASSUNG'
  | 'OMNIBUSSE_UEBER_9_SITZE'
  | 'ZUGMASCHINEN';

export const WAGNISKENNZIFFER_LABEL: Record<Wagniskennziffer, string> = {
  KRAFTRAEDER_MIT_ZULASSUNG: 'Krafträder mit Zulassungskennzeichen',
  OMNIBUSSE_UEBER_9_SITZE: 'Omnibusse über 9 Sitze',
  ZUGMASCHINEN: 'Zugmaschinen',
};

export type Einheit = 'BRUTTOJAHRESMIETE' | 'ANZAHL' | 'FLAECHE';
export const EINHEIT_LABEL: Record<Einheit, string> = {
  BRUTTOJAHRESMIETE: 'Bruttojahresmiete',
  ANZAHL: 'Anzahl',
  FLAECHE: 'Fläche',
};

/** Payload-Formen (nur Werte) für die Übertragung ans Backend. */
export interface NutzungValues {
  nutzungsart: string | undefined;
  wert: number | undefined;
}
export interface GrundstueckValues {
  nutzungen: NutzungValues[];
}
export interface FahrzeugValues {
  wagniskennziffer: Wagniskennziffer | undefined;
}
export interface DeckungValues {
  risikoart: RisikoartId | undefined;
  rabatt: number | undefined;
  zuschlag: number | undefined;
  fahrzeuge: FahrzeugValues[];
  grundstuecke: GrundstueckValues[];
}
