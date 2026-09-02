import { BEHALTEN, setze } from '../../../core/engine';
import type { DatenManipulationErgebnis } from '../../../core/engine';
import type { Versicherer } from '../../versicherer';
import type { DeckungKontext } from '../deckung.kontext';
import type { RisikoartId } from '../deckung.typen';
import { STANDARD_RISIKOART } from '../risikoart-katalog';
import { risikoartWertebereich } from './risikoart.wertebereich';

/**
 * Legt einen Standardwert fest, solange der aktuelle Wert nicht im (nach
 * Kombinatorik gefilterten) Wertebereich liegt:
 *   - bevorzugt die Standard-Risikoart des Versicherers (23 / 300023 / 17)
 *   - sonst die erste noch freie Option
 * Eine gültige Benutzerauswahl bleibt unangetastet.
 */
export function risikoartDatenmanipulation(
  ctx: DeckungKontext,
): DatenManipulationErgebnis<RisikoartId> {
  const optionen = risikoartWertebereich(ctx);
  const aktuell = ctx.risikoartDieserDeckung();
  if (aktuell != null && optionen.some((o) => o.wert === aktuell)) {
    return BEHALTEN;
  }

  const standard = STANDARD_RISIKOART[ctx.wert<Versicherer>('versicherer') ?? 'HCR'];
  if (optionen.some((o) => o.wert === standard)) {
    return setze(standard);
  }
  return setze(optionen[0]?.wert);
}
