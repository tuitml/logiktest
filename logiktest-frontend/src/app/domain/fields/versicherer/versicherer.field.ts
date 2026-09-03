import type { FieldModule } from '../../../core/engine';
import type { Versicherer } from '../../versicherer';
import type { VertragsdatenContext } from '../vertragsdaten.context';
import { versichererDatenmanipulation } from './versicherer.datenmanipulation';
import { versichererSteuerung } from './versicherer.steuerung';
import { versichererValidierung } from './versicherer.validierung';
import { versichererWertebereich } from './versicherer.wertebereich';

export const versichererField: FieldModule<Versicherer, VertragsdatenContext> = {
  id: 'versicherer',
  label: 'Versicherer',
  type: 'select',
  dependencies: [],
  steuerung: versichererSteuerung,
  wertebereich: versichererWertebereich,
  datenmanipulation: versichererDatenmanipulation,
  validierung: versichererValidierung,
};
