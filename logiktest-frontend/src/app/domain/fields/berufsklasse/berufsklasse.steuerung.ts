import { STEUERUNG_AN, STEUERUNG_AUS } from '../../../core/engine';
import type { Steuerung } from '../../../core/engine';
import type { Tarifgruppe } from '../vertragsdaten.types';
import type { Versicherer } from '../../versicherer';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/**
 * Sichtbar & veränderbar nur bei Tarifgruppe "Nicht öffentlicher Dienst"
 * und Versicherer VRK. Sonst unsichtbar, nicht veränderbar, nicht relevant.
 */
export function berufsklasseSteuerung(ctx: VertragsdatenContext): Steuerung {
  const on =
    ctx.value<Tarifgruppe>('tarifgruppe') === 'NICHT_OED' &&
    ctx.value<Versicherer>('versicherer') === 'VRK';
  return on ? STEUERUNG_AN : STEUERUNG_AUS;
}
