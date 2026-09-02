import type { FeldModul } from '../../../core/engine';
import type { Versicherer } from '../../versicherer';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';
import { versichererDatenmanipulation } from './versicherer.datenmanipulation';
import { versichererSteuerung } from './versicherer.steuerung';
import { versichererValidierung } from './versicherer.validierung';
import { versichererWertebereich } from './versicherer.wertebereich';

export const versichererFeld: FeldModul<Versicherer, VertragsdatenKontext> = {
  id: 'versicherer',
  label: 'Versicherer',
  typ: 'select',
  abhaengigkeiten: [],
  steuerung: versichererSteuerung,
  wertebereich: versichererWertebereich,
  datenmanipulation: versichererDatenmanipulation,
  validierung: versichererValidierung,
};
