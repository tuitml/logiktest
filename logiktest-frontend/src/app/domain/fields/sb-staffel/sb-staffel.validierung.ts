import type { SbStaffel } from '../vertragsdaten.types';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/** Pflichtfeld. */
export function sbStaffelValidierung(ctx: VertragsdatenContext): string[] {
  return ctx.value<SbStaffel>('sbStaffel') == null
    ? ['Selbstbeteiligung ist ein Pflichtfeld.']
    : [];
}
