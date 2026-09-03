import type { FieldModule } from '../../../core/engine';
import type { VertragsdatenContext } from '../vertragsdaten.context';
import { tarifSteuerung } from './tarif.steuerung';
import { tarifValidierung } from './tarif.validierung';

/**
 * Freies Eingabefeld. Keine Datenmanipulation (rein benutzergetrieben),
 * kein Wertebereich (Text). Treibt ARB und Tarifgruppe.
 */
export const tarifField: FieldModule<string, VertragsdatenContext> = {
  id: 'tarif',
  label: 'Tarif',
  type: 'text',
  dependencies: [],
  steuerung: tarifSteuerung,
  validierung: tarifValidierung,
};
