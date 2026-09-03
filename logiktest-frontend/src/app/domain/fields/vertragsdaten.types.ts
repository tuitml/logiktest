/** Wertelisten der Vertragsdaten-Felder mit Anzeige-Labels. */

export type Tarifgruppe = 'NICHT_OED' | 'OED' | 'SELBSTSTAENDIG';
export const TARIFGRUPPE_LABEL: Record<Tarifgruppe, string> = {
  NICHT_OED: 'Nicht öffentlicher Dienst',
  OED: 'Öffentlicher Dienst',
  SELBSTSTAENDIG: 'Selbstständig',
};

export type Berufsklasse = 'KEINE' | 'MITARBEITER_SOZIALE_EINRICHTUNGEN';
export const BERUFSKLASSE_LABEL: Record<Berufsklasse, string> = {
  KEINE: 'Keine Berufsklasse',
  MITARBEITER_SOZIALE_EINRICHTUNGEN: 'Mitarbeiter sozialer Einrichtungen',
};

export type Lebenssituation =
  | 'SINGLE'
  | 'SINGLE_MIT_KINDERN'
  | 'PAAR_OHNE_KINDER'
  | 'FAMILIE_MIT_KINDERN'
  | 'UNBEKANNT';
export const LEBENSSITUATION_LABEL: Record<Lebenssituation, string> = {
  SINGLE: 'Single',
  SINGLE_MIT_KINDERN: 'Single mit Kindern',
  PAAR_OHNE_KINDER: 'Paar ohne Kinder',
  FAMILIE_MIT_KINDERN: 'Familie mit Kindern',
  UNBEKANNT: 'Unbekannt',
};

export type Preisstand = '20251001_ARB2025' | '20261001_ARB2026';
export const PREISSTAND_LABEL: Record<Preisstand, string> = {
  '20251001_ARB2025': '20251001_ARB2025',
  '20261001_ARB2026': '20261001_ARB2026',
};

export type SbStaffel = 150 | 250 | 300;

export type Zahlungsart = 'UEBERWEISUNG' | 'LASTSCHRIFTEINZUG';
export const ZAHLUNGSART_LABEL: Record<Zahlungsart, string> = {
  UEBERWEISUNG: 'Überweisung',
  LASTSCHRIFTEINZUG: 'Lastschrifteinzug',
};
