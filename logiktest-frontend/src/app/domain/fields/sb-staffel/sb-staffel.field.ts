import type { FieldModule } from '../../../core/engine';
import type { SbStaffel } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';
import { sbStaffelDatenmanipulation } from './sb-staffel.datenmanipulation';
import { sbStaffelSteuerung } from './sb-staffel.steuerung';
import { sbStaffelValidierung } from './sb-staffel.validierung';
import { sbStaffelWertebereich } from './sb-staffel.wertebereich';

export const sbStaffelField: FieldModule<SbStaffel, VertragsdatenContext> = {
  id: 'sbStaffel',
  label: 'Selbstbeteiligung',
  type: 'select',
  dependencies: ['arb'],
  steuerung: sbStaffelSteuerung,
  wertebereich: sbStaffelWertebereich,
  datenmanipulation: sbStaffelDatenmanipulation,
  validierung: sbStaffelValidierung,
};
