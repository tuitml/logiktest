import { STEUERUNG_AN, STEUERUNG_AUS } from '../../../core/engine';
import type { Steuerung } from '../../../core/engine';
import type { FahrzeugContext } from '../deckung.context';

/**
 * Sichtbar & veränderbar nur wenn ARB < 2025 UND die Risikoart der Deckung
 * RA17 oder RA100017 ist. Sonst unsichtbar, nicht veränderbar, nicht relevant.
 */
export function wagniskennzifferSteuerung(ctx: FahrzeugContext): Steuerung {
  const arb = ctx.arb();
  const ra = ctx.deckungRisikoart();
  const on = arb != null && arb < 2025 && (ra === '17' || ra === '100017');
  return on ? STEUERUNG_AN : STEUERUNG_AUS;
}
