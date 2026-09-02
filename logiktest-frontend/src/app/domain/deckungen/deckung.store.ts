import { computed, inject, Injectable, Injector, signal } from '@angular/core';

import type { FeldId } from '../../core/engine';
import { AuthStore } from '../../core/auth/auth.store';
import { VertragsdatenStore } from '../fields/vertragsdaten.store';
import { DeckungRuntime } from './deckung.runtime';
import type { DeckungWerte, RisikoartId } from './deckung.typen';
import { kannDeckungHinzufuegen } from './kombinatorik';

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
    this.initialisieren();
  }

  initialisieren(): void {
    this._deckungen.set([]);
    const erste = this.erzeugeDeckung();
    this._deckungen.set([erste]);
    erste.initialisieren();
  }

  private erzeugeDeckung(): DeckungRuntime {
    return new DeckungRuntime(
      {
        auth: this.auth.lese(),
        vertragsWert: <T>(id: FeldId) => this.vertragsdaten.store.feld<T>(id).rohWert(),
        andereRisikoarten: (selbst) =>
          this._deckungen()
            .filter((d) => d !== selbst)
            .map((d) => d.risikoartWert())
            .filter((r): r is RisikoartId => r != null),
      },
      this.injector,
    );
  }

  readonly kannHinzufuegen = computed(() =>
    kannDeckungHinzufuegen(this._deckungen().map((d) => d.risikoartWert())),
  );
  readonly kannEntfernen = computed(() => this._deckungen().length >= 2);

  hinzufuegen(): void {
    if (!this.kannHinzufuegen()) {
      return;
    }
    const neue = this.erzeugeDeckung();
    this._deckungen.update((l) => [...l, neue]);
    neue.initialisieren();
  }

  entfernen(deckung: DeckungRuntime): void {
    if (this._deckungen().length <= 1) {
      return;
    }
    this._deckungen.update((l) => l.filter((d) => d !== deckung));
    this._deckungen().forEach((d) => d.regelnAnwenden());
  }

  /** Zentrale Änderungs-Schnittstelle für die Oberfläche. */
  aendereFeld(deckung: DeckungRuntime, id: FeldId, wert: unknown): void {
    deckung.setzeFeld(id, wert);
    if (id === 'risikoart') {
      this._deckungen()
        .filter((d) => d !== deckung)
        .forEach((d) => d.regelnAnwenden());
    }
  }

  readonly gueltig = computed(
    () => this._deckungen().length >= 1 && this._deckungen().every((d) => d.gueltig()),
  );

  payload(): DeckungWerte[] {
    return this._deckungen().map((d) => d.payload());
  }
}
