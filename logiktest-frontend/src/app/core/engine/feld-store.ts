import { Injector } from '@angular/core';

import type { FeldId } from './feld.model';
import type { FeldModul } from './feld-modul';
import { FeldRuntime } from './feld-runtime';
import { RegelEngine } from './regel-engine';
import type { RegelKontext } from './regel-kontext';

/**
 * Verwaltet eine Menge zusammengehöriger Felder (z. B. ein Tab oder eine Deckung)
 * mit gemeinsamem Kontext-Typ `K`.
 *
 * Die Menge der `rohWert`-Signale aller Felder ist die Source of Truth für diesen
 * Geltungsbereich. Der Kontext liest ausschließlich daraus (bzw. aus Auth /
 * übergeordneten Stores).
 */
export class FeldStore<K extends RegelKontext = RegelKontext> {
  private readonly module = new Map<FeldId, FeldModul<unknown, K>>();
  private readonly runtimes = new Map<FeldId, FeldRuntime<unknown, K>>();
  private readonly engine: RegelEngine<K>;
  private readonly kontext: K;

  constructor(
    module: ReadonlyArray<FeldModul<any, K>>,
    kontextFabrik: (store: FeldStore<K>) => K,
    injector: Injector,
  ) {
    for (const m of module) {
      this.module.set(m.id, m as FeldModul<unknown, K>);
    }

    this.kontext = kontextFabrik(this);
    const ctx = (): K => this.kontext;

    for (const m of module) {
      this.runtimes.set(m.id, new FeldRuntime(m as FeldModul<unknown, K>, ctx, injector));
    }

    this.engine = new RegelEngine<K>(this.module, (id) => this.runtimes.get(id), ctx);
  }

  feld<T = unknown>(id: FeldId): FeldRuntime<T, K> {
    const rt = this.runtimes.get(id);
    if (!rt) {
      throw new Error(`Unbekanntes Feld: ${id}`);
    }
    return rt as unknown as FeldRuntime<T, K>;
  }

  hatFeld(id: FeldId): boolean {
    return this.runtimes.has(id);
  }

  alleFelder(): ReadonlyArray<FeldRuntime<unknown, K>> {
    return [...this.runtimes.values()];
  }

  /** Frischer Start: Initialwerte setzen, danach Regeln einmal durchlaufen lassen (Defaults). */
  initialisieren(): void {
    for (const [id, m] of this.module) {
      this.runtimes.get(id)!.rohWert.set(m.initialWert);
    }
    this.engine.propagieren();
  }

  /** Benutzeränderung: Wert setzen, danach greifen die Regeln wieder. */
  benutzerAenderung<T>(id: FeldId, wert: T | undefined): void {
    this.feld(id).rohWert.set(wert);
    this.engine.propagieren();
  }

  /**
   * Regeln erneut anwenden, ohne dass sich in DIESEM Store ein Wert geändert hat.
   * Wird z. B. von der Deckungs-Logik genutzt, wenn sich eine Nachbar-Deckung
   * geändert hat.
   */
  regelnAnwenden(): void {
    this.engine.propagieren();
  }

  /**
   * Import: alle übergebenen Werte setzen – OHNE die Regeln laufen zu lassen.
   * Ableitungen (Steuerung/Wertebereich/Validierung) aktualisieren sich trotzdem,
   * weil sie reine `computed` sind.
   */
  importieren(daten: Readonly<Record<FeldId, unknown>>): void {
    for (const [id, wert] of Object.entries(daten)) {
      const rt = this.runtimes.get(id);
      if (rt) {
        rt.rohWert.set(wert);
      }
    }
  }

  zuruecksetzen(): void {
    this.initialisieren();
  }

  /** Nur die Werte der aktuell relevanten Felder – für die Übertragung ans Backend. */
  werte(): Record<FeldId, unknown> {
    const ausgabe: Record<FeldId, unknown> = {};
    for (const [id, rt] of this.runtimes) {
      if (rt.steuerung().relevant) {
        ausgabe[id] = rt.rohWert();
      }
    }
    return ausgabe;
  }
}
