import type { FieldModule } from '../../core/engine';
import type { VertragsdatenContext } from './vertragsdaten.context';

import { versichererField } from './versicherer/versicherer.field';
import { tarifField } from './tarif/tarif.field';
import { arbField } from './arb/arb.field';
import { tarifgruppeField } from './tarifgruppe/tarifgruppe.field';
import { postleitzahlField } from './postleitzahl/postleitzahl.field';
import { sbStaffelField } from './sb-staffel/sb-staffel.field';
import { berufsklasseField } from './berufsklasse/berufsklasse.field';
import { lebenssituationField } from './lebenssituation/lebenssituation.field';
import { preisstandField } from './preisstand/preisstand.field';
import { zahlungsartField } from './zahlungsart/zahlungsart.field';

/**
 * Alle Felder rund um die Vertragsdaten.
 * Reihenfolge = Registrierungsreihenfolge (Versicherer zuerst, dann abgeleitete Felder).
 * Die Zuordnung zu Tabs passiert an anderer Stelle (tab-config.ts).
 */
export const VERTRAGSDATEN_FIELDS: ReadonlyArray<FieldModule<any, VertragsdatenContext>> = [
  versichererField,
  tarifField,
  arbField,
  tarifgruppeField,
  postleitzahlField,
  sbStaffelField,
  berufsklasseField,
  lebenssituationField,
  preisstandField,
  zahlungsartField,
];
