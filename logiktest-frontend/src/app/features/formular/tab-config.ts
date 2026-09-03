import type { FieldId } from '../../core/engine';

export type TabId = 'vertragsdaten' | 'deckungen' | 'ergebnis';

export interface TabDefinition {
  readonly id: TabId;
  readonly number: string;
  readonly title: string;
}

export const TABS: ReadonlyArray<TabDefinition> = [
  { id: 'vertragsdaten', number: '01', title: 'Vertragsdaten' },
  { id: 'deckungen', number: '02', title: 'Deckungen' },
  { id: 'ergebnis', number: '03', title: 'Ergebnis' },
];

/**
 * DIE einzige Stelle, die weiß, welches Feld in welchem Tab liegt.
 * Die Felder selbst kennen ihren Tab nicht.
 *
 * "versicherer" steht bewusst NICHT hier – es gehört zu keinem Tab und wird in
 * der Kopfzeile angezeigt. "arb" / "tarifgruppe" sind unsichtbare, immer gültige
 * Ableitungen und müssen die Weiter-Navigation nicht blockieren.
 */
export const TAB_FIELDS: Record<'vertragsdaten', ReadonlyArray<FieldId>> = {
  vertragsdaten: [
    'tarif',
    'postleitzahl',
    'sbStaffel',
    'berufsklasse',
    'lebenssituation',
    'preisstand',
    'zahlungsart',
  ],
};
