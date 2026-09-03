import { computed, inject, Injectable, Injector, signal } from '@angular/core';

import type { FieldId } from '../../core/engine';
import { AuthStore } from '../../core/auth/auth.store';
import { VertragsdatenStore } from '../fields/vertragsdaten.store';
import { DeckungRuntime } from './deckung.runtime';
import type { DeckungValues, RisikoartId } from './deckung.types';
import { canAddDeckung } from './combination';
import type { ImportDeckung } from '../import/import.model';

/**
 * Verwaltet die Liste der Deckungen des Tabs "Deckungen".
 *
 * Mindestens eine Deckung muss bestehen. Der Kontext jeder Deckung liest den
 * Versicherer / ARB aus dem VertragsdatenStore und die Risikoarten der anderen
 * Deckungen aus dieser Liste.
 */
@Injectable({ providedIn: 'root' })
export class DeckungStore {
  private readonly auth = inject(AuthStore);
  private readonly injector = inject(Injector);
  private readonly vertragsdaten = inject(VertragsdatenStore);

  private readonly _deckungen = signal<ReadonlyArray<DeckungRuntime>>([]);
  readonly deckungen = this._deckungen.asReadonly();

  constructor() {
    this.initialize();
  }

  initialize(): void {
    const first = this.createDeckung();
    this._deckungen.set([first]);
    first.initialize();
  }

  private createDeckung(): DeckungRuntime {
    return new DeckungRuntime(
      {
        auth: this.auth.reader(),
        vertragValue: <T>(id: FieldId) => this.vertragsdaten.store.field<T>(id).value(),
        otherRisikoarten: (self) =>
          this._deckungen()
            .filter((d) => d !== self)
            .map((d) => d.risikoartValue())
            .filter((r): r is RisikoartId => r != null),
      },
      this.injector,
    );
  }

  readonly canAdd = computed(() =>
    canAddDeckung(this._deckungen().map((d) => d.risikoartValue())),
  );
  readonly canRemove = computed(() => this._deckungen().length >= 2);

  add(): void {
    if (!this.canAdd()) {
      return;
    }
    const existing = this._deckungen();
    const next = this.createDeckung();
    this._deckungen.update((l) => [...l, next]);
    next.initialize();
    // bestehende Deckungen kennen jetzt eine weitere Nachbar-Risikoart
    existing.forEach((d) => d.applyRules());
  }

  remove(deckung: DeckungRuntime): void {
    if (this._deckungen().length <= 1) {
      return;
    }
    this._deckungen.update((l) => l.filter((d) => d !== deckung));
    this._deckungen().forEach((d) => d.applyRules());
  }

  /**
   * Import: die Deckungsliste exakt aus den Backend-Daten aufbauen – OHNE Regeln.
   * Leere Liste -> Fallback auf genau eine Default-Deckung (Mindestanzahl 1).
   */
  applyImport(data: ReadonlyArray<ImportDeckung>): void {
    if (data.length === 0) {
      this.initialize();
      return;
    }
    this._deckungen.set(
      data.map((d) => {
        const deckung = this.createDeckung();
        deckung.applyImport(d);
        return deckung;
      }),
    );
  }

  /** Zentrale Änderungs-Schnittstelle für die Oberfläche. */
  changeField(deckung: DeckungRuntime, id: FieldId, value: unknown): void {
    deckung.setField(id, value);
    if (id === 'risikoart') {
      this._deckungen()
        .filter((d) => d !== deckung)
        .forEach((d) => d.applyRules());
    }
  }

  readonly valid = computed(
    () => this._deckungen().length >= 1 && this._deckungen().every((d) => d.valid()),
  );

  payload(): DeckungValues[] {
    return this._deckungen().map((d) => d.payload());
  }
}
