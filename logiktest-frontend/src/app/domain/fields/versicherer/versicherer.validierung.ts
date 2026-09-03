import type { Versicherer } from '../../versicherer';
import type { VertragsdatenContext } from '../vertragsdaten.context';
import { versichererWertebereich } from './versicherer.wertebereich';

export function versichererValidierung(ctx: VertragsdatenContext): string[] {
  const value = ctx.value<Versicherer>('versicherer');
  if (value == null) {
    return ['Versicherer ist ein Pflichtfeld.'];
  }
  if (!versichererWertebereich(ctx).some((o) => o.value === value)) {
    return ['Versicherer ist für die aktuelle Berechtigung nicht zulässig.'];
  }
  return [];
}
