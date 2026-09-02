/**
 * Ein FeldModul bündelt die vier Logik-Teile eines Feldes plus Metadaten.
 * Pro Feld liegt jeder Teil in einer eigenen Datei:
 *
 *   <feld>.steuerung.ts          -> steuerung(ctx)
 *   <feld>.wertebereich.ts       -> wertebereich(ctx)
 *   <feld>.datenmanipulation.ts  -> datenmanipulation(ctx)
 *   <feld>.validierung.ts        -> validierung(ctx) / asyncValidierung(ctx, wert)
 *   <feld>.feld.ts               -> setzt die Teile zu einem FeldModul zusammen
 */

import type {
  DatenManipulationErgebnis,
  FeldId,
  FeldTyp,
  SelectOption,
  Steuerung,
} from './feld.model';
import type { RegelKontext } from './regel-kontext';

export interface FeldModul<T = unknown, K extends RegelKontext = RegelKontext> {
  readonly id: FeldId;
  readonly label: string;
  readonly typ: FeldTyp;
  readonly initialWert?: T;

  /**
   * Felder, deren Wert in diesem Feld gelesen wird. Wird nur für die
   * topologische Reihenfolge der Datenmanipulation genutzt – Zyklen sind
   * erlaubt (die Fixpunkt-Iteration fängt sie auf), aber unnötig.
   */
  readonly abhaengigkeiten: ReadonlyArray<FeldId>;

  steuerung(ctx: K): Steuerung;
  wertebereich?(ctx: K): ReadonlyArray<SelectOption<T>>;
  datenmanipulation?(ctx: K): DatenManipulationErgebnis<T>;
  validierung?(ctx: K): string[];
  asyncValidierung?(ctx: K, wert: T | undefined): Promise<string[]>;
}
