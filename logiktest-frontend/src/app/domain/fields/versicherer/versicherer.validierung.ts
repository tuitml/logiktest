import type { Versicherer } from '../../versicherer';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';
import { versichererWertebereich } from './versicherer.wertebereich';

export function versichererValidierung(ctx: VertragsdatenKontext): string[] {
  const wert = ctx.wert<Versicherer>('versicherer');
  if (wert == null) {
    return ['Versicherer ist ein Pflichtfeld.'];
  }
  if (!versichererWertebereich(ctx).some((o) => o.wert === wert)) {
    return ['Versicherer ist für die aktuelle Berechtigung nicht zulässig.'];
  }
  return [];
}
