/**
 * Grundtypen der Regel-Engine.
 *
 * Ein Feld ist die kleinste Einheit: es hat genau einen schreibbaren Rohwert,
 * alles andere (Sichtbarkeit, Optionen, Fehler, Gültigkeit) ist daraus abgeleitet.
 */

export type FeldId = string;

export type FeldTyp = 'text' | 'select' | 'zahl';

export interface SelectOption<T = unknown> {
  readonly wert: T;
  readonly label: string;
}

export interface Steuerung {
  /** Feld wird in der Oberfläche angezeigt. */
  readonly sichtbar: boolean;
  /** Benutzer darf den Wert ändern. */
  readonly bearbeitbar: boolean;
  /** Wert ist fachlich relevant. Wenn `false`: Validierung wird ignoriert, Wert
   *  fließt nicht in die Übertragung ein. */
  readonly relevant: boolean;
}

export const STEUERUNG_AUS: Steuerung = { sichtbar: false, bearbeitbar: false, relevant: false };
export const STEUERUNG_AN: Steuerung = { sichtbar: true, bearbeitbar: true, relevant: true };

/**
 * Das eine Objekt, das eine Feld-Web-Component gebunden bekommt.
 * Wert und Optionen sind immer gemeinsam enthalten – dadurch entstehen keine
 * Timing-Lücken (Wert vor Optionen).
 */
export interface FeldView<T = unknown> {
  readonly id: FeldId;
  readonly label: string;
  readonly typ: FeldTyp;
  readonly wert: T | undefined;
  readonly optionen: ReadonlyArray<SelectOption<T>>;
  readonly sichtbar: boolean;
  readonly bearbeitbar: boolean;
  readonly relevant: boolean;
  readonly fehler: ReadonlyArray<string>;
  readonly gueltig: boolean;
  readonly pruefungLaeuft: boolean;
}

/** Ergebnis einer Datenmanipulation: entweder ein neuer Wert oder "nicht anfassen". */
export const BEHALTEN = Symbol('BEHALTEN');
export type WertAenderung<T> = { readonly wert: T | undefined };
export type DatenManipulationErgebnis<T> = WertAenderung<T> | typeof BEHALTEN;

/** Setzt das Feld auf einen konkreten Wert. */
export function setze<T>(wert: T | undefined): WertAenderung<T> {
  return { wert };
}

/** Setzt das Feld auf undefined (z. B. wenn es nicht mehr relevant ist). */
export function leeren(): WertAenderung<never> {
  return { wert: undefined };
}
