import { STEUERUNG_AN } from '../../../core/engine';
import type { Steuerung } from '../../../core/engine';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

/** Immer sichtbar und veränderbar. */
export function sbStaffelSteuerung(_ctx: VertragsdatenKontext): Steuerung {
  return STEUERUNG_AN;
}
