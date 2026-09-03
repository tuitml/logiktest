import type { AuthReader, FieldReader, RuleContext, Services } from '../../core/engine';
import type { FieldStore } from '../../core/engine';

/** Alle Feld-IDs des Tabs "Vertragsdaten" (Versicherer gehört zu keinem Tab, ist aber hier registriert). */
export type VertragsdatenFieldId =
  | 'versicherer'
  | 'arb'
  | 'tarifgruppe'
  | 'tarif'
  | 'postleitzahl'
  | 'sbStaffel'
  | 'berufsklasse'
  | 'lebenssituation'
  | 'preisstand'
  | 'zahlungsart';

/** Kontext-Typ für Vertragsdaten-Felder – hier identisch zum Basiskontext. */
export type VertragsdatenContext = RuleContext;

export function buildVertragsdatenContext(
  store: FieldStore<VertragsdatenContext>,
  auth: AuthReader,
  services: Services,
): VertragsdatenContext {
  return {
    value: <T>(id: string) => store.field<T>(id).value(),
    field: (id: string): FieldReader => {
      const rt = store.field(id);
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
        get options() {
          return rt.options();
        },
        value: <T>() => rt.value() as T | undefined,
      };
    },
    auth,
    services,
  };
}
