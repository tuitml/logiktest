/**
 * Grundtypen der Regel-Engine.
 *
 * Ein Feld ist die kleinste Einheit: es hat genau einen schreibbaren Wert,
 * alles andere (Sichtbarkeit, Optionen, Fehler, Gültigkeit) ist daraus abgeleitet.
 */

export type FieldId = string;

export type FieldType = 'text' | 'select' | 'zahl';

export interface SelectOption<T = unknown> {
  readonly value: T;
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
export interface FieldView<T = unknown> {
  readonly id: FieldId;
  readonly label: string;
  readonly type: FieldType;
  readonly value: T | undefined;
  readonly options: ReadonlyArray<SelectOption<T>>;
  readonly sichtbar: boolean;
  readonly bearbeitbar: boolean;
  readonly relevant: boolean;
  readonly errors: ReadonlyArray<string>;
  readonly gueltig: boolean;
  readonly checking: boolean;
}

/**
 * Ergebnis einer Datenmanipulation:
 *   `KEEP`        -> Feld nicht anfassen
 *   ein Wert / `undefined` -> Feld auf genau diesen Wert setzen
 */
export const KEEP = Symbol('KEEP');
export type DatenmanipulationResult<T> = T | undefined | typeof KEEP;
