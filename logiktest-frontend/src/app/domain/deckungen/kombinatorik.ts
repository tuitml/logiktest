import type { RisikoartId } from './deckung.typen';
import type { RisikoartOption } from './risikoart-katalog';

/** RA 15 / 102015: schließt jede weitere Deckung aus. */
export const RA_ALLEINSTEHEND: ReadonlySet<RisikoartId> = new Set(['15', '102015']);

/** RA 10 / 200010 (Fahrer-RS): nur mit einem Partner aus RA_FAHRER_PARTNER kombinierbar. */
export const RA_FAHRER: ReadonlySet<RisikoartId> = new Set(['10', '200010']);
export const RA_FAHRER_PARTNER: ReadonlySet<RisikoartId> = new Set([
  '19',
  '119',
  '310019',
  '310119',
]);

/**
 * Auswählbare Risikoarten für EINE Deckung.
 *
 *  - jede Risikoart maximal einmal (bereits in anderen Deckungen vergebene fallen weg)
 *  - existiert bereits ein Fahrer-RS (RA10/200010), sind nur noch dessen Partner erlaubt
 *  - der aktuell gesetzte Wert bleibt immer wählbar (sonst könnte man ihn nicht behalten)
 */
export function risikoartOptionen(
  katalog: ReadonlyArray<RisikoartOption>,
  andereRisikoarten: ReadonlyArray<RisikoartId>,
  eigeneRisikoart: RisikoartId | undefined,
): RisikoartOption[] {
  const vergeben = new Set(andereRisikoarten);
  const fahrerVorhanden = [...vergeben].some((r) => RA_FAHRER.has(r));

  return katalog.filter((option) => {
    if (option.wert === eigeneRisikoart) {
      return true;
    }
    if (vergeben.has(option.wert)) {
      return false;
    }
    if (fahrerVorhanden) {
      return RA_FAHRER_PARTNER.has(option.wert);
    }
    return true;
  });
}

/**
 * Darf überhaupt noch eine weitere Deckung hinzugefügt werden?
 *  - nein, wenn eine alleinstehende RA (15/102015) vorhanden ist
 *  - nein, wenn ein Fahrer-RS bereits seinen Partner hat (Paar komplett)
 */
export function kannDeckungHinzufuegen(
  alleRisikoarten: ReadonlyArray<RisikoartId | undefined>,
): boolean {
  const gesetzt = alleRisikoarten.filter((r): r is RisikoartId => r != null);
  if (gesetzt.some((r) => RA_ALLEINSTEHEND.has(r))) {
    return false;
  }
  const fahrer = gesetzt.some((r) => RA_FAHRER.has(r));
  const partner = gesetzt.some((r) => RA_FAHRER_PARTNER.has(r));
  if (fahrer && partner) {
    return false;
  }
  return true;
}
