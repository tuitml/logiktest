import type { Steuerung } from '../../../core/engine';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

/** Nie sichtbar, nie veränderbar – abgeleitet und intern verwendet. */
export function tarifgruppeSteuerung(_ctx: VertragsdatenKontext): Steuerung {
  return { sichtbar: false, bearbeitbar: false, relevant: true };
}
