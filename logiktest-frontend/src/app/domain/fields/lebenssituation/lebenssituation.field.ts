import type { FieldModule } from '../../../core/engine';
import type { Lebenssituation } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';
import { lebenssituationDatenmanipulation } from './lebenssituation.datenmanipulation';
import { lebenssituationSteuerung } from './lebenssituation.steuerung';
import { lebenssituationValidierung } from './lebenssituation.validierung';
import { lebenssituationWertebereich } from './lebenssituation.wertebereich';

export const lebenssituationField: FieldModule<Lebenssituation, VertragsdatenContext> = {
  id: 'lebenssituation',
  label: 'Lebenssituation',
  type: 'select',
  dependencies: ['arb'],
  steuerung: lebenssituationSteuerung,
  wertebereich: lebenssituationWertebereich,
  datenmanipulation: lebenssituationDatenmanipulation,
  validierung: lebenssituationValidierung,
};
