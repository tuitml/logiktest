import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

export const PLZ_MUSTER = /^[0-9]{5}$/;

/** Synchron: nur das Muster. */
export function postleitzahlValidierung(ctx: VertragsdatenKontext): string[] {
  const plz = ctx.wert<string>('postleitzahl');
  if (plz == null || plz === '') {
    return ['Postleitzahl ist ein Pflichtfeld.'];
  }
  if (!PLZ_MUSTER.test(plz)) {
    return ['Postleitzahl muss aus genau 5 Ziffern bestehen.'];
  }
  return [];
}

/**
 * Asynchron: bei formal korrekter PLZ den Backend-Dienst fragen.
 * Wird von der Engine nur aufgerufen, wenn die synchrone Prüfung fehlerfrei ist.
 */
export async function postleitzahlAsyncValidierung(
  ctx: VertragsdatenKontext,
  wert: string | undefined,
): Promise<string[]> {
  if (!wert || !PLZ_MUSTER.test(wert)) {
    return [];
  }
  const bekannt = await ctx.dienste.plz.pruefe(wert);
  return bekannt ? [] : ['Postleitzahl ist unbekannt.'];
}
