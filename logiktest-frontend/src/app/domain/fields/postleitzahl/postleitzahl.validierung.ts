import type { VertragsdatenContext } from '../vertragsdaten.context';

export const PLZ_PATTERN = /^[0-9]{5}$/;

/** Synchron: nur das Muster. */
export function postleitzahlValidierung(ctx: VertragsdatenContext): string[] {
  const plz = ctx.value<string>('postleitzahl');
  if (plz == null || plz === '') {
    return ['Postleitzahl ist ein Pflichtfeld.'];
  }
  if (!PLZ_PATTERN.test(plz)) {
    return ['Postleitzahl muss aus genau 5 Ziffern bestehen.'];
  }
  return [];
}

/**
 * Asynchron: bei formal korrekter PLZ den Backend-Dienst fragen.
 * Wird von der Engine nur aufgerufen, wenn die synchrone Prüfung fehlerfrei ist.
 */
export async function postleitzahlAsyncValidierung(
  ctx: VertragsdatenContext,
  value: string | undefined,
): Promise<string[]> {
  if (!value || !PLZ_PATTERN.test(value)) {
    return [];
  }
  const known = await ctx.services.plz.check(value);
  return known ? [] : ['Postleitzahl ist unbekannt.'];
}
