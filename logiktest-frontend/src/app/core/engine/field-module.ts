/**
 * Ein FieldModule bündelt die vier Logik-Teile eines Feldes plus Metadaten.
 * Pro Feld liegt jeder Teil in einer eigenen Datei:
 *
 *   <feld>.steuerung.ts          -> steuerung(ctx)
 *   <feld>.wertebereich.ts       -> wertebereich(ctx)
 *   <feld>.datenmanipulation.ts  -> datenmanipulation(ctx)
 *   <feld>.validierung.ts        -> validierung(ctx) / asyncValidierung(ctx, value)
 *   <feld>.field.ts              -> setzt die Teile zu einem FieldModule zusammen
 */

import type {
  DatenmanipulationResult,
  FieldId,
  FieldType,
  SelectOption,
  Steuerung,
} from './field.model';
import type { RuleContext } from './rule-context';

export interface FieldModule<T = unknown, K extends RuleContext = RuleContext> {
  readonly id: FieldId;
  readonly label: string;
  readonly type: FieldType;
  readonly initialValue?: T;

  /**
   * Felder, deren Wert in diesem Feld gelesen wird. Wird nur für die
   * topologische Reihenfolge der Datenmanipulation genutzt – Zyklen sind
   * erlaubt (die Fixpunkt-Iteration fängt sie auf), aber unnötig.
   */
  readonly dependencies: ReadonlyArray<FieldId>;

  steuerung(ctx: K): Steuerung;
  wertebereich?(ctx: K): ReadonlyArray<SelectOption<T>>;
  datenmanipulation?(ctx: K): DatenmanipulationResult<T>;
  validierung?(ctx: K): string[];
  asyncValidierung?(ctx: K, value: T | undefined): Promise<string[]>;
}
