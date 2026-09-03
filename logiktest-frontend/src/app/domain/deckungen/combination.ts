import type { RisikoartId } from './deckung.types';
import type { RisikoartOption } from './risikoart-catalog';

/** RA 15 / 102015: nur zulässig, wenn es GENAU EINE Deckung gibt und diese die 15 ist. */
export const RA_STANDALONE: ReadonlySet<RisikoartId> = new Set(['15', '102015']);

/** RA 10 / 200010 (Fahrer-RS): nur allein oder mit GENAU EINEM Partner daneben. */
export const RA_FAHRER: ReadonlySet<RisikoartId> = new Set(['10', '200010']);
export const RA_FAHRER_PARTNER: ReadonlySet<RisikoartId> = new Set([
  '19',
  '119',
  '310019',
  '310119',
]);

/**
 * Auswählbare Risikoarten für EINE Deckung – abhängig von den Risikoarten der
 * ANDEREN Deckungen (`otherRisikoarten`).
 *
 *  1. jede Risikoart maximal einmal insgesamt
 *  2. RA 15 / 102015 nur, wenn es keine weitere Deckung gibt
 *  3. hat eine andere Deckung einen Fahrer-RS (RA10/200010), darf diese Deckung
 *     NUR ein Partner (19/119 bzw. 310019/310119) sein
 *  4. ein Fahrer-RS ist hier nur wählbar, wenn es keine andere Deckung gibt
 *     oder genau eine – und die ist ein Partner
 */
export function risikoartOptions(
  catalog: ReadonlyArray<RisikoartOption>,
  otherRisikoarten: ReadonlyArray<RisikoartId>,
): RisikoartOption[] {
  const others = new Set(otherRisikoarten);
  const otherCount = others.size;
  const fahrerElsewhere = [...others].some((r) => RA_FAHRER.has(r));
  const onlyPartnersBeside =
    otherCount >= 1 && [...others].every((r) => RA_FAHRER_PARTNER.has(r));

  return catalog.filter((option) => {
    const w = option.value;

    if (others.has(w)) {
      return false; // (1) Eindeutigkeit
    }
    if (RA_STANDALONE.has(w)) {
      return otherCount === 0; // (2)
    }
    if (fahrerElsewhere && !RA_FAHRER_PARTNER.has(w)) {
      return false; // (3)
    }
    if (RA_FAHRER.has(w)) {
      return otherCount === 0 || onlyPartnersBeside; // (4)
    }
    return true;
  });
}

/**
 * Darf noch eine weitere Deckung hinzugefügt werden?
 *  - nein bei alleinstehender RA (15 / 102015)
 *  - bei Fahrer-RS nur, solange dessen einziger Partner noch fehlt (max. 2 Deckungen)
 */
export function canAddDeckung(
  allRisikoarten: ReadonlyArray<RisikoartId | undefined>,
): boolean {
  const set = allRisikoarten.filter((r): r is RisikoartId => r != null);

  if (set.some((r) => RA_STANDALONE.has(r))) {
    return false;
  }
  if (set.some((r) => RA_FAHRER.has(r))) {
    const partners = set.filter((r) => RA_FAHRER_PARTNER.has(r)).length;
    return partners === 0 && set.length < 2;
  }
  return true;
}
