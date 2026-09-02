import { computed, effect, Injector, signal, Signal, untracked, WritableSignal } from '@angular/core';

import type { FeldView, SelectOption, Steuerung } from './feld.model';
import type { FeldModul } from './feld-modul';
import type { RegelKontext } from './regel-kontext';
import { gleich } from './gleichheit';

/**
 * Laufzeit-Zustand eines Feldes.
 *
 * Einziger schreibbarer Zustand: `rohWert`. Alles andere ist ein `computed`
 * und dadurch immer konsistent. `view` liefert genau EIN eingefrorenes Objekt
 * pro logischer Änderung – ideal für Web Components (1 Render pro Änderung,
 * Wert + Optionen immer gemeinsam).
 */
export class FeldRuntime<T = unknown, K extends RegelKontext = RegelKontext> {
  readonly rohWert: WritableSignal<T | undefined>;

  private readonly _asyncFehler = signal<ReadonlyArray<string>>([]);
  private readonly _pruefungLaeuft = signal(false);

  readonly steuerung: Signal<Steuerung>;
  readonly optionen: Signal<ReadonlyArray<SelectOption<T>>>;
  readonly syncFehler: Signal<ReadonlyArray<string>>;
  readonly fehler: Signal<ReadonlyArray<string>>;
  readonly gueltig: Signal<boolean>;
  readonly view: Signal<FeldView<T>>;

  constructor(
    readonly modul: FeldModul<T, K>,
    private readonly kontext: () => K,
    injector: Injector,
  ) {
    this.rohWert = signal<T | undefined>(modul.initialWert);

    this.steuerung = computed(() => this.modul.steuerung(this.kontext()));

    this.optionen = computed(() =>
      this.modul.wertebereich ? this.modul.wertebereich(this.kontext()) : [],
    );

    this.syncFehler = computed<ReadonlyArray<string>>(() => {
      if (!this.steuerung().relevant) {
        return [];
      }
      const eigene = this.modul.validierung ? this.modul.validierung(this.kontext()) : [];

      // Ein Feld mit Wertebereich kann nie mit einem Wert außerhalb der aktuellen
      // Optionen gültig sein. Im normalen Ablauf räumt die Datenmanipulation solche
      // Werte weg; nach einem Import (kein Regel-Durchlauf) macht diese Prüfung eine
      // inkonsistente Auswahl sichtbar.
      if (this.modul.wertebereich && eigene.length === 0) {
        const wert = this.rohWert();
        const optionen = this.optionen();
        if (wert != null && !optionen.some((o) => gleich(o.wert, wert))) {
          return ['Wert ist im aktuellen Kontext nicht zulässig.'];
        }
      }
      return eigene;
    });

    this.fehler = computed<ReadonlyArray<string>>(() => [
      ...this.syncFehler(),
      ...this._asyncFehler(),
    ]);

    this.gueltig = computed(() => {
      if (!this.steuerung().relevant) {
        return true;
      }
      return this.fehler().length === 0 && !this._pruefungLaeuft();
    });

    this.view = computed<FeldView<T>>(() => {
      const s = this.steuerung();
      return Object.freeze({
        id: this.modul.id,
        label: this.modul.label,
        typ: this.modul.typ,
        wert: this.rohWert(),
        optionen: this.optionen(),
        sichtbar: s.sichtbar,
        bearbeitbar: s.bearbeitbar,
        relevant: s.relevant,
        fehler: this.fehler(),
        gueltig: this.gueltig(),
        pruefungLaeuft: this._pruefungLaeuft(),
      });
    });

    if (this.modul.asyncValidierung) {
      this.installiereAsyncValidierung(injector);
    }
  }

  /** Sichtbarkeits-/Bearbeitbarkeits-Kurzform (wie in der Spezifikation gewünscht). */
  isSichtbar(): boolean {
    return this.steuerung().sichtbar;
  }
  isBearbeitbar(): boolean {
    return this.steuerung().bearbeitbar;
  }
  isRelevant(): boolean {
    return this.steuerung().relevant;
  }
  isGueltig(): boolean {
    return this.gueltig();
  }

  private installiereAsyncValidierung(injector: Injector): void {
    let sequenz = 0;
    effect(
      (onCleanup) => {
        const wert = this.rohWert();
        const relevant = this.steuerung().relevant;
        const syncOk = this.syncFehler().length === 0;

        if (!relevant || !syncOk) {
          this._asyncFehler.set([]);
          this._pruefungLaeuft.set(false);
          return;
        }

        const lauf = ++sequenz;
        this._pruefungLaeuft.set(true);

        const timer = setTimeout(() => {
          void this.modul
            .asyncValidierung!(untracked(this.kontext), wert)
            .then((fehler) => {
              if (lauf === sequenz) {
                this._asyncFehler.set(fehler);
                this._pruefungLaeuft.set(false);
              }
            })
            .catch(() => {
              if (lauf === sequenz) {
                this._asyncFehler.set(['Prüfung fehlgeschlagen.']);
                this._pruefungLaeuft.set(false);
              }
            });
        }, 300);

        onCleanup(() => clearTimeout(timer));
      },
      { injector },
    );
  }
}
