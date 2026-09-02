import { STEUERUNG_AN, STEUERUNG_AUS } from '../../../core/engine';
import type { Steuerung } from '../../../core/engine';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

/**
 * ARB < 2026 -> nicht sichtbar, nicht veränderbar, nicht relevant.
 * ARB >= 2026 -> sichtbar und veränderbar.
 */
export function lebenssituationSteuerung(ctx: VertragsdatenKontext): Steuerung {
  const arb = ctx.wert<number>('arb');
  return arb != null && arb >= 2026 ? STEUERUNG_AN : STEUERUNG_AUS;
}
