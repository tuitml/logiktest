import type { FeldModul } from '../../../core/engine';
import type { SbStaffel } from '../vertragsdaten.typen';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';
import { sbStaffelDatenmanipulation } from './sb-staffel.datenmanipulation';
import { sbStaffelSteuerung } from './sb-staffel.steuerung';
import { sbStaffelValidierung } from './sb-staffel.validierung';
import { sbStaffelWertebereich } from './sb-staffel.wertebereich';

export const sbStaffelFeld: FeldModul<SbStaffel, VertragsdatenKontext> = {
  id: 'sbStaffel',
  label: 'Selbstbeteiligung',
  typ: 'select',
  abhaengigkeiten: ['arb'],
  steuerung: sbStaffelSteuerung,
  wertebereich: sbStaffelWertebereich,
  datenmanipulation: sbStaffelDatenmanipulation,
  validierung: sbStaffelValidierung,
};
