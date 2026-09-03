import { STEUERUNG_AN } from '../../../core/engine';
import type { Steuerung } from '../../../core/engine';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/** Immer sichtbar und veränderbar. */
export function postleitzahlSteuerung(_ctx: VertragsdatenContext): Steuerung {
  return STEUERUNG_AN;
}
