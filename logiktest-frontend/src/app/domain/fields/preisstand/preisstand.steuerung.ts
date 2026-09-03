import { STEUERUNG_AUS } from '../../../core/engine';
import type { Steuerung } from '../../../core/engine';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/**
 * ARB < 2025 -> nicht sichtbar, nicht veränderbar, nicht relevant.
 * ARB >= 2025 -> sichtbar, aber NICHT veränderbar (wird abgeleitet).
 */
export function preisstandSteuerung(ctx: VertragsdatenContext): Steuerung {
  const arb = ctx.value<number>('arb');
  if (arb == null || arb < 2025) {
    return STEUERUNG_AUS;
  }
  return { sichtbar: true, bearbeitbar: false, relevant: true };
}
