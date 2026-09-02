import { BEHALTEN, setze } from '../../../core/engine';
import type { DatenManipulationErgebnis } from '../../../core/engine';
import type { Versicherer } from '../../versicherer';
import type { DeckungKontext } from '../deckung.kontext';
import type { RisikoartId } from '../deckung.typen';
import { RA_ALLEINSTEHEND, RA_FAHRER } from '../kombinatorik';
import { STANDARD_RISIKOART } from '../risikoart-katalog';
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

  const normale = optionen.find(
    (o) => !RA_FAHRER.has(o.wert) && !RA_ALLEINSTEHEND.has(o.wert),
  );
  return setze((normale ?? optionen[0])?.wert);
}
