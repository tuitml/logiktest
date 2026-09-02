import type { FeldModul } from '../../../core/engine';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';
import { tarifSteuerung } from './tarif.steuerung';
import { tarifValidierung } from './tarif.validierung';

/**
 * Freies Eingabefeld. Keine Datenmanipulation (rein benutzergetrieben),
 * kein Wertebereich (Text). Treibt ARB und Tarifgruppe.
 */
export const tarifFeld: FeldModul<string, VertragsdatenKontext> = {
  id: 'tarif',
  label: 'Tarif',
  typ: 'text',
  abhaengigkeiten: [],
  steuerung: tarifSteuerung,
  validierung: tarifValidierung,
};
