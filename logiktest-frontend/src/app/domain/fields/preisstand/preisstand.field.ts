import type { FieldModule } from '../../../core/engine';
import type { Preisstand } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';
import { preisstandDatenmanipulation } from './preisstand.datenmanipulation';
import { preisstandSteuerung } from './preisstand.steuerung';
import { preisstandValidierung } from './preisstand.validierung';
import { preisstandWertebereich } from './preisstand.wertebereich';

export const preisstandField: FieldModule<Preisstand, VertragsdatenContext> = {
  id: 'preisstand',
  label: 'Preisstand',
  type: 'select',
  dependencies: ['arb'],
  steuerung: preisstandSteuerung,
  wertebereich: preisstandWertebereich,
  datenmanipulation: preisstandDatenmanipulation,
  validierung: preisstandValidierung,
};
