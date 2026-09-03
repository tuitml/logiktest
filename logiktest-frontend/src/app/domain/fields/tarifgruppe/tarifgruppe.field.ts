import type { FieldModule } from '../../../core/engine';
import type { Tarifgruppe } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';
import { tarifgruppeDatenmanipulation } from './tarifgruppe.datenmanipulation';
import { tarifgruppeSteuerung } from './tarifgruppe.steuerung';

export const tarifgruppeField: FieldModule<Tarifgruppe, VertragsdatenContext> = {
  id: 'tarifgruppe',
  label: 'Tarifgruppe',
  type: 'select',
  dependencies: ['tarif'],
  steuerung: tarifgruppeSteuerung,
  datenmanipulation: tarifgruppeDatenmanipulation,
};
