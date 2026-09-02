import type { RisikoartId } from './deckung.typen';
import type { RisikoartOption } from './risikoart-katalog';

/** RA 15 / 102015: nur zulässig, wenn es GENAU EINE Deckung gibt und diese die 15 ist. */
export const RA_ALLEINSTEHEND: ReadonlySet<RisikoartId> = new Set(['15', '102015']);

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
 * ANDEREN Deckungen (`andereRisikoarten`).
 *
 *  1. jede Risikoart maximal einmal insgesamt
 *  2. RA 15 / 102015 nur, wenn es keine weitere Deckung gibt
 *  3. hat eine andere Deckung einen Fahrer-RS (RA10/200010), darf diese Deckung
 *     NUR ein Partner (19/119 bzw. 310019/310119) sein
 *  4. ein Fahrer-RS ist hier nur wählbar, wenn es keine andere Deckung gibt
 *     oder genau eine – und die ist ein Partner
 */
export function risikoartOptionen(
  katalog: ReadonlyArray<RisikoartOption>,
  andereRisikoarten: ReadonlyArray<RisikoartId>,
): RisikoartOption[] {
  const andere = new Set(andereRisikoarten);
  const anzahlAndere = andere.size;
  const fahrerAnderswo = [...andere].some((r) => RA_FAHRER.has(r));
  const nurPartnerDaneben =
    anzahlAndere >= 1 && [...andere].every((r) => RA_FAHRER_PARTNER.has(r));

  return katalog.filter((option) => {
    const w = option.wert;

    if (andere.has(w)) {
      return false; // (1) Eindeutigkeit
    }
    if (RA_ALLEINSTEHEND.has(w)) {
      return anzahlAndere === 0; // (2)
    }
    if (fahrerAnderswo && !RA_FAHRER_PARTNER.has(w)) {
      return false; // (3)
    }
    if (RA_FAHRER.has(w)) {
      return anzahlAndere === 0 || nurPartnerDaneben; // (4)
    }
    return true;
  });
}

/**
 * Darf noch eine weitere Deckung hinzugefügt werden?
 *  - nein bei alleinstehender RA (15 / 102015)
 *  - bei Fahrer-RS nur, solange dessen einziger Partner noch fehlt (max. 2 Deckungen)
 */
export function kannDeckungHinzufuegen(
  alleRisikoarten: ReadonlyArray<RisikoartId | undefined>,
): boolean {
  const gesetzt = alleRisikoarten.filter((r): r is RisikoartId => r != null);

  if (gesetzt.some((r) => RA_ALLEINSTEHEND.has(r))) {
    return false;
  }
  if (gesetzt.some((r) => RA_FAHRER.has(r))) {
    const partner = gesetzt.filter((r) => RA_FAHRER_PARTNER.has(r)).length;
    return partner === 0 && gesetzt.length < 2;
  }
  return true;
}
