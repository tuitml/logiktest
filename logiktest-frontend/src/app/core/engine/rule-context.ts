/**
 * Der RuleContext ist die einzige Schnittstelle, über die Logik-Dateien
 * (steuerung / wertebereich / datenmanipulation / validierung) andere Werte lesen.
 *
 * Alle Zugriffe laufen über Signale, damit die `computed`-Ableitungen ihre
 * Abhängigkeiten automatisch erkennen.
 */

import type { FieldId, SelectOption } from './field.model';

/**
 * Für welche Mandanten der Nutzer berechtigt ist (aus dem Token):
 *   'huk'  -> nur HUK   (Versicherer HCR / HUK24)
 *   'vrk'  -> nur VRK
 *   'both' -> HUK und VRK
 *   'none' -> keine Mandanten-Berechtigung
 */
export type MandantPermission = 'none' | 'huk' | 'vrk' | 'both';

export interface AuthReader {
  permission(): MandantPermission;
}

/** Lesende Sicht auf ein einzelnes anderes Feld. */
export interface FieldReader {
  readonly sichtbar: boolean;
  readonly bearbeitbar: boolean;
  readonly relevant: boolean;
  readonly gueltig: boolean;
  readonly options: ReadonlyArray<SelectOption>;
  value<T = unknown>(): T | undefined;
}

/** Backend-gestützte Prüfdienste (Stubs). */
export interface Services {
  readonly tarif: {
    validTarife(): ReadonlyArray<string>;
    isValid(tarif: string): boolean;
  };
  readonly plz: {
    check(plz: string): Promise<boolean>;
  };
}

export const NO_SERVICES: Services = {
  tarif: { validTarife: () => [], isValid: () => true },
  plz: { check: () => Promise.resolve(true) },
};

export interface RuleContext {
  /** Wert eines anderen Feldes im selben Geltungsbereich. */
  value<T = unknown>(id: FieldId): T | undefined;
  /** Steuerungs-/Gültigkeitssicht auf ein anderes Feld. */
  field(id: FieldId): FieldReader;
  readonly auth: AuthReader;
  readonly services: Services;
}
