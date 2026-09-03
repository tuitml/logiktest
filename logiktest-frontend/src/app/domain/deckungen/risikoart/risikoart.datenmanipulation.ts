import { KEEP } from '../../../core/engine';
import type { DatenmanipulationResult } from '../../../core/engine';
import type { Versicherer } from '../../versicherer';
import type { DeckungContext } from '../deckung.context';
import type { RisikoartId } from '../deckung.types';
import { RA_FAHRER, RA_STANDALONE } from '../combination';
import { DEFAULT_RISIKOART } from '../risikoart-catalog';
import { risikoartWertebereich } from './risikoart.wertebereich';

/**
 * Legt einen Standardwert fest, solange der aktuelle Wert nicht im (nach
 * Kombinatorik gefilterten) Wertebereich liegt:
 *   1. bevorzugt die Standard-Risikoart des Versicherers (23 / 300023 / 17)
 *   2. sonst die erste "normale" Option (kein Fahrer-RS, keine alleinstehende RA)
 *   3. sonst die erste Option überhaupt
 * Eine gültige Benutzerauswahl bleibt unangetastet.
 */
export function risikoartDatenmanipulation(
  ctx: DeckungContext,
): DatenmanipulationResult<RisikoartId> {
  const options = risikoartWertebereich(ctx);
  const current = ctx.ownRisikoart();
  if (current != null && options.some((o) => o.value === current)) {
    return KEEP;
  }

  const standard = DEFAULT_RISIKOART[ctx.value<Versicherer>('versicherer') ?? 'HCR'];
  if (options.some((o) => o.value === standard)) {
    return standard;
  }

  const normal = options.find((o) => !RA_FAHRER.has(o.value) && !RA_STANDALONE.has(o.value));
  return (normal ?? options[0])?.value;
}
