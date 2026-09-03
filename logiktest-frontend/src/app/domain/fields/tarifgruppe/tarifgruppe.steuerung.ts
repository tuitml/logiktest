import type { Steuerung } from '../../../core/engine';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/** Nie sichtbar, nie veränderbar – abgeleitet und intern verwendet. */
export function tarifgruppeSteuerung(_ctx: VertragsdatenContext): Steuerung {
  return { sichtbar: false, bearbeitbar: false, relevant: true };
}
