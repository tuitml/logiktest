import type { FeldModul } from '../../core/engine';
import type { VertragsdatenKontext } from './vertragsdaten.kontext';

import { versichererFeld } from './versicherer/versicherer.feld';
import { tarifFeld } from './tarif/tarif.feld';
import { arbFeld } from './arb/arb.feld';
import { tarifgruppeFeld } from './tarifgruppe/tarifgruppe.feld';
import { postleitzahlFeld } from './postleitzahl/postleitzahl.feld';
import { sbStaffelFeld } from './sb-staffel/sb-staffel.feld';
import { berufsklasseFeld } from './berufsklasse/berufsklasse.feld';
import { lebenssituationFeld } from './lebenssituation/lebenssituation.feld';
import { preisstandFeld } from './preisstand/preisstand.feld';

/**
 * Alle Felder rund um die Vertragsdaten.
 * Reihenfolge = Registrierungsreihenfolge (Versicherer zuerst, dann abgeleitete Felder).
 * Die Zuordnung zu Tabs passiert an anderer Stelle (tab-konfiguration.ts).
 */
export const VERTRAGSDATEN_FELDER: ReadonlyArray<FeldModul<any, VertragsdatenKontext>> = [
  versichererFeld,
  tarifFeld,
  arbFeld,
  tarifgruppeFeld,
  postleitzahlFeld,
  sbStaffelFeld,
  berufsklasseFeld,
  lebenssituationFeld,
  preisstandFeld,
];
