import type { AuthLese, Dienste, FeldLese, RegelKontext } from '../../core/engine';
import type { FeldStore } from '../../core/engine';

/** Alle Feld-IDs des Tabs "Vertragsdaten" (Versicherer gehört zu keinem Tab, ist aber hier registriert). */
export type VertragsdatenFeldId =
  | 'versicherer'
  | 'arb'
  | 'tarifgruppe'
  | 'tarif'
  | 'postleitzahl'
  | 'sbStaffel'
  | 'berufsklasse'
  | 'lebenssituation'
  | 'preisstand';

/** Kontext-Typ für Vertragsdaten-Felder – hier identisch zum Basiskontext. */
export type VertragsdatenKontext = RegelKontext;

export function baueVertragsdatenKontext(
  store: FeldStore<VertragsdatenKontext>,
  auth: AuthLese,
  dienste: Dienste,
): VertragsdatenKontext {
  return {
    wert: <T>(id: string) => store.feld<T>(id).rohWert(),
    feld: (id: string): FeldLese => {
      const rt = store.feld(id);
      return {
        get sichtbar() {
          return rt.steuerung().sichtbar;
        },
        get bearbeitbar() {
          return rt.steuerung().bearbeitbar;
        },
        get relevant() {
          return rt.steuerung().relevant;
        },
        get gueltig() {
          return rt.gueltig();
        },
        get optionen() {
          return rt.optionen();
        },
        wert: <T>() => rt.rohWert() as T | undefined,
      };
    },
    auth,
    dienste,
  };
}
