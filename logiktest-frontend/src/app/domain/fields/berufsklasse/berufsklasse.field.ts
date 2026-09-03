import type { FieldModule } from '../../../core/engine';
import type { Berufsklasse } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';
import { berufsklasseDatenmanipulation } from './berufsklasse.datenmanipulation';
import { berufsklasseSteuerung } from './berufsklasse.steuerung';
import { berufsklasseValidierung } from './berufsklasse.validierung';
import { berufsklasseWertebereich } from './berufsklasse.wertebereich';

export const berufsklasseField: FieldModule<Berufsklasse, VertragsdatenContext> = {
  id: 'berufsklasse',
  label: 'Berufsklasse',
  type: 'select',
  dependencies: ['versicherer', 'tarifgruppe'],
  steuerung: berufsklasseSteuerung,
  wertebereich: berufsklasseWertebereich,
  datenmanipulation: berufsklasseDatenmanipulation,
  validierung: berufsklasseValidierung,
};
