import type { FeldModul } from '../../../core/engine';
import type { Berufsklasse } from '../vertragsdaten.typen';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';
import { berufsklasseDatenmanipulation } from './berufsklasse.datenmanipulation';
import { berufsklasseSteuerung } from './berufsklasse.steuerung';
import { berufsklasseValidierung } from './berufsklasse.validierung';
import { berufsklasseWertebereich } from './berufsklasse.wertebereich';

export const berufsklasseFeld: FeldModul<Berufsklasse, VertragsdatenKontext> = {
  id: 'berufsklasse',
  label: 'Berufsklasse',
  typ: 'select',
  abhaengigkeiten: ['versicherer', 'tarifgruppe'],
  steuerung: berufsklasseSteuerung,
  wertebereich: berufsklasseWertebereich,
  datenmanipulation: berufsklasseDatenmanipulation,
  validierung: berufsklasseValidierung,
};
