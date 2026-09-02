import { STEUERUNG_AUS } from '../../../core/engine';
import type { Steuerung } from '../../../core/engine';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

/**
 * ARB < 2025 -> nicht sichtbar, nicht veränderbar, nicht relevant.
 * ARB >= 2025 -> sichtbar, aber NICHT veränderbar (wird abgeleitet).
 */
export function preisstandSteuerung(ctx: VertragsdatenKontext): Steuerung {
  const arb = ctx.wert<number>('arb');
  if (arb == null || arb < 2025) {
    return STEUERUNG_AUS;
  }
  return { sichtbar: true, bearbeitbar: false, relevant: true };
}
