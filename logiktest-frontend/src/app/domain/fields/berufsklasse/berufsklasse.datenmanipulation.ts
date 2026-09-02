import { BEHALTEN, leeren, setze } from '../../../core/engine';
import type { DatenManipulationErgebnis } from '../../../core/engine';
import type { Berufsklasse } from '../vertragsdaten.typen';
import type { Versicherer } from '../../versicherer';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

/**
 * Versicherer ungleich VRK -> undefined.
 * Versicherer VRK und noch kein Wert -> Default "Keine Berufsklasse".
 */
export function berufsklasseDatenmanipulation(
  ctx: VertragsdatenKontext,
): DatenManipulationErgebnis<Berufsklasse> {
  if (ctx.wert<Versicherer>('versicherer') !== 'VRK') {
    return leeren();
  }
  return ctx.wert<Berufsklasse>('berufsklasse') == null ? setze('KEINE') : BEHALTEN;
}
