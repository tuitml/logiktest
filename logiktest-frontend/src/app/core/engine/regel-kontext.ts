/**
 * Der RegelKontext ist die einzige Schnittstelle, über die Logik-Dateien
 * (steuerung / wertebereich / datenmanipulation / validierung) andere Werte lesen.
 *
 * Alle Zugriffe laufen über Signale, damit die `computed`-Ableitungen ihre
 * Abhängigkeiten automatisch erkennen.
 */

import type { FeldId, SelectOption } from './feld.model';

export type Rolle = 'RBBER_HUK' | 'RBBER_VRK';

export interface AuthLese {
  rollen(): ReadonlyArray<Rolle>;
  hatRolle(rolle: Rolle): boolean;
  hatNurRolle(rolle: Rolle): boolean;
  hatAlleRollen(...rollen: Rolle[]): boolean;
}

/** Lesende Sicht auf ein einzelnes anderes Feld. */
export interface FeldLese {
  readonly sichtbar: boolean;
  readonly bearbeitbar: boolean;
  readonly relevant: boolean;
  readonly gueltig: boolean;
  readonly optionen: ReadonlyArray<SelectOption>;
  wert<T = unknown>(): T | undefined;
}

/** Backend-gestützte Prüfdienste (Stubs). */
export interface Dienste {
  readonly tarif: {
    gueltigeTarife(): ReadonlyArray<string>;
    istGueltig(tarif: string): boolean;
  };
  readonly plz: {
    pruefe(plz: string): Promise<boolean>;
  };
}

export const KEINE_DIENSTE: Dienste = {
  tarif: { gueltigeTarife: () => [], istGueltig: () => true },
  plz: { pruefe: () => Promise.resolve(true) },
};

export interface RegelKontext {
  /** Rohwert eines anderen Feldes im selben Geltungsbereich. */
  wert<T = unknown>(id: FeldId): T | undefined;
  /** Steuerungs-/Gültigkeitssicht auf ein anderes Feld. */
  feld(id: FeldId): FeldLese;
  readonly auth: AuthLese;
  readonly dienste: Dienste;
}
