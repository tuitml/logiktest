import { STEUERUNG_AN, STEUERUNG_AUS } from '../../../core/engine';
import type { Steuerung } from '../../../core/engine';
import type { Tarifgruppe } from '../vertragsdaten.typen';
import type { Versicherer } from '../../versicherer';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

/**
 * Sichtbar & veränderbar nur bei Tarifgruppe "Nicht öffentlicher Dienst"
 * und Versicherer VRK. Sonst unsichtbar, nicht veränderbar, nicht relevant.
 */
export function berufsklasseSteuerung(ctx: VertragsdatenKontext): Steuerung {
  const an =
    ctx.wert<Tarifgruppe>('tarifgruppe') === 'NICHT_OED' &&
    ctx.wert<Versicherer>('versicherer') === 'VRK';
  return an ? STEUERUNG_AN : STEUERUNG_AUS;
}
