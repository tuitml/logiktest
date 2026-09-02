import type { FeldModul } from '../../../core/engine';
import type { Lebenssituation } from '../vertragsdaten.typen';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';
import { lebenssituationDatenmanipulation } from './lebenssituation.datenmanipulation';
import { lebenssituationSteuerung } from './lebenssituation.steuerung';
import { lebenssituationValidierung } from './lebenssituation.validierung';
import { lebenssituationWertebereich } from './lebenssituation.wertebereich';

export const lebenssituationFeld: FeldModul<Lebenssituation, VertragsdatenKontext> = {
  id: 'lebenssituation',
  label: 'Lebenssituation',
  typ: 'select',
  abhaengigkeiten: ['arb'],
  steuerung: lebenssituationSteuerung,
  wertebereich: lebenssituationWertebereich,
  datenmanipulation: lebenssituationDatenmanipulation,
  validierung: lebenssituationValidierung,
};
