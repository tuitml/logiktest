import type { FeldModul } from '../../../core/engine';
import type { Tarifgruppe } from '../vertragsdaten.typen';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';
import { tarifgruppeDatenmanipulation } from './tarifgruppe.datenmanipulation';
import { tarifgruppeSteuerung } from './tarifgruppe.steuerung';

export const tarifgruppeFeld: FeldModul<Tarifgruppe, VertragsdatenKontext> = {
  id: 'tarifgruppe',
  label: 'Tarifgruppe',
  typ: 'select',
  abhaengigkeiten: ['tarif'],
  steuerung: tarifgruppeSteuerung,
  datenmanipulation: tarifgruppeDatenmanipulation,
};
