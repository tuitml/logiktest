import { Injector } from '@angular/core';

import type { FieldId } from './field.model';
import type { FieldModule } from './field-module';
import { FieldRuntime } from './field-runtime';
import { RuleEngine } from './rule-engine';
import type { RuleContext } from './rule-context';

/**
 * Verwaltet eine Menge zusammengehöriger Felder (z. B. ein Tab oder eine Deckung)
 * mit gemeinsamem Kontext-Typ `K`.
 *
 * Die Menge der `value`-Signale aller Felder ist die Source of Truth für diesen
 * Geltungsbereich. Der Kontext liest ausschließlich daraus (bzw. aus Auth /
 * übergeordneten Stores).
 */
export class FieldStore<K extends RuleContext = RuleContext> {
  private readonly modules = new Map<FieldId, FieldModule<unknown, K>>();
  private readonly runtimes = new Map<FieldId, FieldRuntime<unknown, K>>();
  private readonly engine: RuleEngine<K>;
  private readonly ctx: K;

  constructor(
    modules: ReadonlyArray<FieldModule<any, K>>,
    createContext: (store: FieldStore<K>) => K,
    injector: Injector,
  ) {
    for (const m of modules) {
      this.modules.set(m.id, m as FieldModule<unknown, K>);
    }

    this.ctx = createContext(this);
    const ctx = (): K => this.ctx;

    for (const m of modules) {
      this.runtimes.set(m.id, new FieldRuntime(m as FieldModule<unknown, K>, ctx, injector));
    }

    this.engine = new RuleEngine<K>(this.modules, (id) => this.runtimes.get(id), ctx);
  }

  field<T = unknown>(id: FieldId): FieldRuntime<T, K> {
    const rt = this.runtimes.get(id);
    if (!rt) {
      throw new Error(`Unbekanntes Feld: ${id}`);
    }
    return rt as unknown as FieldRuntime<T, K>;
  }

  hasField(id: FieldId): boolean {
    return this.runtimes.has(id);
  }

  allFields(): ReadonlyArray<FieldRuntime<unknown, K>> {
    return [...this.runtimes.values()];
  }

  /** Frischer Start: Initialwerte setzen, danach Regeln einmal durchlaufen lassen (Defaults). */
  initialize(): void {
    for (const [id, m] of this.modules) {
      this.runtimes.get(id)!.value.set(m.initialValue);
    }
    this.engine.propagate();
  }

  /** Benutzeränderung: Wert setzen, danach greifen die Regeln wieder. */
  applyUserChange<T>(id: FieldId, value: T | undefined): void {
    this.field(id).value.set(value);
    this.engine.propagate();
  }

  /**
   * Regeln erneut anwenden, ohne dass sich in DIESEM Store ein Wert geändert hat
   * (z. B. wenn sich eine Nachbar-Deckung geändert hat).
   */
  applyRules(): void {
    this.engine.propagate();
  }

  /**
   * Import: alle übergebenen Werte setzen – OHNE die Regeln laufen zu lassen.
   * Ableitungen (Steuerung/Wertebereich/Validierung) aktualisieren sich trotzdem,
   * weil sie reine `computed` sind.
   */
  applyImport(data: Readonly<Record<FieldId, unknown>>): void {
    for (const [id, value] of Object.entries(data)) {
      this.runtimes.get(id)?.value.set(value);
    }
  }

  /** Nur die Werte der aktuell relevanten Felder – für die Übertragung ans Backend. */
  values(): Record<FieldId, unknown> {
    const out: Record<FieldId, unknown> = {};
    for (const [id, rt] of this.runtimes) {
      if (rt.steuerung().relevant) {
        out[id] = rt.value();
      }
    }
    return out;
  }
}
