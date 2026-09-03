import type { Steuerung } from '../../../core/engine';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/** Nie sichtbar, nie veränderbar – aber fachlich relevant (steuert viele andere Felder). */
export function arbSteuerung(_ctx: VertragsdatenContext): Steuerung {
  return { sichtbar: false, bearbeitbar: false, relevant: true };
}
