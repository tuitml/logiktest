import type { Steuerung } from '../../../core/engine';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

/** Nie sichtbar, nie veränderbar – aber fachlich relevant (steuert viele andere Felder). */
export function arbSteuerung(_ctx: VertragsdatenKontext): Steuerung {
  return { sichtbar: false, bearbeitbar: false, relevant: true };
}
