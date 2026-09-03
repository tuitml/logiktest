import { STEUERUNG_AN, STEUERUNG_AUS } from '../../../core/engine';
import type { Steuerung } from '../../../core/engine';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/**
 * ARB < 2026 -> nicht sichtbar, nicht veränderbar, nicht relevant.
 * ARB >= 2026 -> sichtbar und veränderbar.
 */
export function lebenssituationSteuerung(ctx: VertragsdatenContext): Steuerung {
  const arb = ctx.value<number>('arb');
  return arb != null && arb >= 2026 ? STEUERUNG_AN : STEUERUNG_AUS;
}
