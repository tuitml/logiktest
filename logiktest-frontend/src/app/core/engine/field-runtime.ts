import { computed, effect, Injector, signal, Signal, untracked, WritableSignal } from '@angular/core';

import type { FieldView, SelectOption, Steuerung } from './field.model';
import type { FieldModule } from './field-module';
import type { RuleContext } from './rule-context';
import { equal } from './equal';

/**
 * Laufzeit-Zustand eines Feldes.
 *
 * Einziger schreibbarer Zustand: `value`. Alles andere ist ein `computed`
 * und dadurch immer konsistent. `view` liefert genau EIN eingefrorenes Objekt
 * pro logischer Änderung – ideal für Web Components (1 Render pro Änderung,
 * Wert + Optionen immer gemeinsam).
 */
export class FieldRuntime<T = unknown, K extends RuleContext = RuleContext> {
  readonly value: WritableSignal<T | undefined>;

  private readonly _asyncErrors = signal<ReadonlyArray<string>>([]);
  private readonly _checking = signal(false);

  readonly steuerung: Signal<Steuerung>;
  readonly options: Signal<ReadonlyArray<SelectOption<T>>>;
  readonly syncErrors: Signal<ReadonlyArray<string>>;
  readonly errors: Signal<ReadonlyArray<string>>;
  readonly gueltig: Signal<boolean>;
  readonly view: Signal<FieldView<T>>;

  constructor(
    readonly module: FieldModule<T, K>,
    private readonly ctx: () => K,
    injector: Injector,
  ) {
    this.value = signal<T | undefined>(module.initialValue);

    this.steuerung = computed(() => this.module.steuerung(this.ctx()));

    this.options = computed(() =>
      this.module.wertebereich ? this.module.wertebereich(this.ctx()) : [],
    );

    this.syncErrors = computed<ReadonlyArray<string>>(() => {
      if (!this.steuerung().relevant) {
        return [];
      }
      const own = this.module.validierung ? this.module.validierung(this.ctx()) : [];

      // Ein Feld mit Wertebereich kann nie mit einem Wert außerhalb der aktuellen
      // Optionen gültig sein. Im normalen Ablauf räumt die Datenmanipulation solche
      // Werte weg; nach einem Import (kein Regel-Durchlauf) macht diese Prüfung eine
      // inkonsistente Auswahl sichtbar.
      if (this.module.wertebereich && own.length === 0) {
        const value = this.value();
        if (value != null && !this.options().some((o) => equal(o.value, value))) {
          return ['Wert ist im aktuellen Kontext nicht zulässig.'];
        }
      }
      return own;
    });

    this.errors = computed<ReadonlyArray<string>>(() => [
      ...this.syncErrors(),
      ...this._asyncErrors(),
    ]);

    this.gueltig = computed(() => {
      if (!this.steuerung().relevant) {
        return true;
      }
      return this.errors().length === 0 && !this._checking();
    });

    this.view = computed<FieldView<T>>(() => {
      const s = this.steuerung();
      return Object.freeze({
        id: this.module.id,
        label: this.module.label,
        type: this.module.type,
        value: this.value(),
        options: this.options(),
        sichtbar: s.sichtbar,
        bearbeitbar: s.bearbeitbar,
        relevant: s.relevant,
        errors: this.errors(),
        gueltig: this.gueltig(),
        checking: this._checking(),
      });
    });

    if (this.module.asyncValidierung) {
      this.setupAsyncValidierung(injector);
    }
  }

  private setupAsyncValidierung(injector: Injector): void {
    let sequence = 0;
    effect(
      (onCleanup) => {
        const value = this.value();
        const relevant = this.steuerung().relevant;
        const syncOk = this.syncErrors().length === 0;

        if (!relevant || !syncOk) {
          this._asyncErrors.set([]);
          this._checking.set(false);
          return;
        }

        const run = ++sequence;
        this._checking.set(true);

        const timer = setTimeout(() => {
          void this.module
            .asyncValidierung!(untracked(this.ctx), value)
            .then((errors) => {
              if (run === sequence) {
                this._asyncErrors.set(errors);
                this._checking.set(false);
              }
            })
            .catch(() => {
              if (run === sequence) {
                this._asyncErrors.set(['Prüfung fehlgeschlagen.']);
                this._checking.set(false);
              }
            });
        }, 300);

        onCleanup(() => clearTimeout(timer));
      },
      { injector },
    );
  }
}
