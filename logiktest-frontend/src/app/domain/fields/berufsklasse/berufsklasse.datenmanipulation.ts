import { KEEP } from '../../../core/engine';
import type { DatenmanipulationResult } from '../../../core/engine';
import type { Berufsklasse } from '../vertragsdaten.types';
import type { Versicherer } from '../../versicherer';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/**
 * Versicherer ungleich VRK -> undefined.
 * Versicherer VRK und noch kein Wert -> Default "Keine Berufsklasse".
 */
export function berufsklasseDatenmanipulation(
  ctx: VertragsdatenContext,
): DatenmanipulationResult<Berufsklasse> {
  if (ctx.value<Versicherer>('versicherer') !== 'VRK') {
    return undefined;
  }
  return ctx.value<Berufsklasse>('berufsklasse') == null ? 'KEINE' : KEEP;
}
