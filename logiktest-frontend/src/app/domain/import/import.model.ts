import type { VertragsdatenFeldId } from '../fields/vertragsdaten.kontext';
import type { RisikoartId } from '../deckungen/deckung.typen';

/** Ergebnis des Mappings Backend -> App. Nur Werte, keine Regeln. */
export interface ImportErgebnis {
  readonly vertragsdaten: Partial<Record<VertragsdatenFeldId, unknown>>;
  readonly deckungen: ReadonlyArray<ImportDeckung>;
}

export interface ImportDeckung {
  readonly risikoart?: RisikoartId;
  readonly rabatt?: number;
  readonly zuschlag?: number;
  readonly fahrzeuge: ReadonlyArray<ImportFahrzeug>;
  readonly grundstuecke: ReadonlyArray<ImportGrundstueck>;
}

export interface ImportFahrzeug {
  readonly wagniskennziffer?: string;
}

export interface ImportGrundstueck {
  readonly nutzungen: ReadonlyArray<ImportNutzung>;
}

export interface ImportNutzung {
  readonly nutzungsart?: string;
  readonly wert?: number;
}
