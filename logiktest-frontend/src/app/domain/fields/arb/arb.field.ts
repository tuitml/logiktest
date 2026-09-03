import type { FieldModule } from '../../../core/engine';
import type { VertragsdatenContext } from '../vertragsdaten.context';
import { arbDatenmanipulation } from './arb.datenmanipulation';
import { arbSteuerung } from './arb.steuerung';

/**
 * ARB (Allgemeine Rechtsschutzbedingungen) als Jahreszahl.
 * Rein abgeleitet aus dem Tarif – keine eigene Validierung, kein Wertebereich.
 */
export const arbField: FieldModule<number, VertragsdatenContext> = {
  id: 'arb',
  label: 'ARB',
  type: 'zahl',
  dependencies: ['tarif'],
  steuerung: arbSteuerung,
  datenmanipulation: arbDatenmanipulation,
};
