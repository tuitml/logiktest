import type { FeldId } from '../../core/engine';

export type TabId = 'vertragsdaten' | 'deckungen' | 'ergebnis';

export interface TabDefinition {
  readonly id: TabId;
  readonly nummer: string;
  readonly titel: string;
}

export const TABS: ReadonlyArray<TabDefinition> = [
  { id: 'vertragsdaten', nummer: '01', titel: 'Vertragsdaten' },
  { id: 'deckungen', nummer: '02', titel: 'Deckungen' },
  { id: 'ergebnis', nummer: '03', titel: 'Ergebnis' },
];

/**
 * DIE einzige Stelle, die weiß, welches Feld in welchem Tab liegt.
 * Die Felder selbst kennen ihren Tab nicht.
 *
 * "versicherer" steht bewusst NICHT hier – es gehört zu keinem Tab und wird in
 * der Kopfzeile angezeigt. "arb" / "tarifgruppe" sind unsichtbare, immer gültige
 * Ableitungen und müssen die Weiter-Navigation nicht blockieren.
 */
export const TAB_FELDER: Record<'vertragsdaten', ReadonlyArray<FeldId>> = {
  vertragsdaten: [
    'tarif',
    'postleitzahl',
    'sbStaffel',
    'berufsklasse',
    'lebenssituation',
    'preisstand',
  ],
};

/** Anzeigereihenfolge im 2-Spalten-Grid des Tabs "Vertragsdaten". */
export const VERTRAGSDATEN_GRID: ReadonlyArray<FeldId> = TAB_FELDER.vertragsdaten;
