import type { FeldModul } from '../../../core/engine';
import type { Preisstand } from '../vertragsdaten.typen';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';
import { preisstandDatenmanipulation } from './preisstand.datenmanipulation';
import { preisstandSteuerung } from './preisstand.steuerung';
import { preisstandValidierung } from './preisstand.validierung';
import { preisstandWertebereich } from './preisstand.wertebereich';

export const preisstandFeld: FeldModul<Preisstand, VertragsdatenKontext> = {
  id: 'preisstand',
  label: 'Preisstand',
  typ: 'select',
  abhaengigkeiten: ['arb'],
  steuerung: preisstandSteuerung,
  wertebereich: preisstandWertebereich,
  datenmanipulation: preisstandDatenmanipulation,
  validierung: preisstandValidierung,
};
