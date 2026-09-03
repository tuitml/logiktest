import type { FieldModule } from '../../../core/engine';
import type { Zahlungsart } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';
import { zahlungsartDatenmanipulation } from './zahlungsart.datenmanipulation';
import { zahlungsartSteuerung } from './zahlungsart.steuerung';
import { zahlungsartValidierung } from './zahlungsart.validierung';
import { zahlungsartWertebereich } from './zahlungsart.wertebereich';

export const zahlungsartField: FieldModule<Zahlungsart, VertragsdatenContext> = {
  id: 'zahlungsart',
  label: 'Zahlungsart',
  type: 'select',
  dependencies: ['arb'],
  steuerung: zahlungsartSteuerung,
  wertebereich: zahlungsartWertebereich,
  datenmanipulation: zahlungsartDatenmanipulation,
  validierung: zahlungsartValidierung,
};
