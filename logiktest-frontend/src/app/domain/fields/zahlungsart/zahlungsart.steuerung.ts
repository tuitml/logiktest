import { STEUERUNG_AN, STEUERUNG_AUS } from '../../../core/engine';
import type { Steuerung } from '../../../core/engine';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/**
 * ARB < 2025 -> nicht sichtbar, nicht veränderbar, nicht relevant.
 * ARB >= 2025 -> sichtbar und veränderbar.
 */
export function zahlungsartSteuerung(ctx: VertragsdatenContext): Steuerung {
  const arb = ctx.value<number>('arb');
  return arb != null && arb >= 2025 ? STEUERUNG_AN : STEUERUNG_AUS;
}
