import type { VertragsdatenContext } from '../vertragsdaten.context';

/** Erste Stelle B/N/S, danach 2–4 Ziffern (also 3 bis 5 Stellen gesamt). */
export const TARIF_PATTERN = /^[BNS][0-9]{2,4}$/;

/**
 * Gültig, wenn das Muster passt UND der Tarif im Katalog der gültigen Tarife steht.
 */
export function tarifValidierung(ctx: VertragsdatenContext): string[] {
  const tarif = ctx.value<string>('tarif');
  if (tarif == null || tarif === '') {
    return ['Tarif ist ein Pflichtfeld.'];
  }
  if (!TARIF_PATTERN.test(tarif)) {
    return ['Tarif muss mit B, N oder S beginnen, gefolgt von 2–4 Ziffern.'];
  }
  if (!ctx.services.tarif.isValid(tarif)) {
    return ['Dieser Tarif ist nicht gültig.'];
  }
  return [];
}
