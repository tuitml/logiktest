import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

/** Erste Stelle B/N/S, danach 2–4 Ziffern (also 3 bis 5 Stellen gesamt). */
export const TARIF_MUSTER = /^[BNS][0-9]{2,4}$/;

/**
 * Gültig, wenn das Muster passt UND der Tarif im Katalog der gültigen Tarife steht.
 */
export function tarifValidierung(ctx: VertragsdatenKontext): string[] {
  const tarif = ctx.wert<string>('tarif');
  if (tarif == null || tarif === '') {
    return ['Tarif ist ein Pflichtfeld.'];
  }
  if (!TARIF_MUSTER.test(tarif)) {
    return ['Tarif muss mit B, N oder S beginnen, gefolgt von 2–4 Ziffern.'];
  }
  if (!ctx.dienste.tarif.istGueltig(tarif)) {
    return ['Dieser Tarif ist nicht gültig.'];
  }
  return [];
}
