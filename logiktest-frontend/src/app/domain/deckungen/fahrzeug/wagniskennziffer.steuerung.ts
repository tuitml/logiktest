import { STEUERUNG_AN, STEUERUNG_AUS } from '../../../core/engine';
import type { Steuerung } from '../../../core/engine';
import type { FahrzeugKontext } from '../deckung.kontext';

/**
 * Sichtbar & veränderbar nur wenn ARB < 2025 UND die Risikoart der Deckung
 * RA17 oder RA100017 ist. Sonst unsichtbar, nicht veränderbar, nicht relevant.
 */
export function wagniskennzifferSteuerung(ctx: FahrzeugKontext): Steuerung {
  const arb = ctx.arb();
  const ra = ctx.risikoartDerDeckung();
  const an = arb != null && arb < 2025 && (ra === '17' || ra === '100017');
  return an ? STEUERUNG_AN : STEUERUNG_AUS;
}
