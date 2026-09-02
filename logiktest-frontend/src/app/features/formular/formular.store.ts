import { computed, inject, Injectable, signal } from '@angular/core';

import { VertragsdatenStore } from '../../domain/fields/vertragsdaten.store';
import { DeckungStore } from '../../domain/deckungen/deckung.store';
import { TAB_FELDER, type TabId } from './tab-konfiguration';

/**
 * Klammert Vertragsdaten + Deckungen zusammen: aktiver Tab, Weiter-Navigation,
 * Import / Reset und die finale Payload (nur Werte) für das Backend.
 */
@Injectable({ providedIn: 'root' })
export class FormularStore {
  private readonly vertragsdaten = inject(VertragsdatenStore);
  private readonly deckungen = inject(DeckungStore);

  readonly aktiverTab = signal<TabId>('vertragsdaten');
  readonly importHinweis = signal<string | null>(null);

  readonly vertragsdatenGueltig = computed(() =>
    TAB_FELDER.vertragsdaten.every((id) => this.vertragsdaten.store.feld(id).gueltig()),
  );
  readonly deckungenGueltig = computed(() => this.deckungen.gueltig());

  /** Darf zu diesem Tab gewechselt werden? Voraussetzung: alle vorherigen Tabs gültig. */
  darfWechselnZu(tab: TabId): boolean {
    switch (tab) {
      case 'vertragsdaten':
        return true;
      case 'deckungen':
        return this.vertragsdatenGueltig();
      case 'ergebnis':
        return this.vertragsdatenGueltig() && this.deckungenGueltig();
    }
  }

  wechsleZu(tab: TabId): void {
    if (this.darfWechselnZu(tab)) {
      this.aktiverTab.set(tab);
    }
  }

  weiter(): void {
    const reihenfolge: TabId[] = ['vertragsdaten', 'deckungen', 'ergebnis'];
    const naechster = reihenfolge[reihenfolge.indexOf(this.aktiverTab()) + 1];
    if (naechster) {
      this.wechsleZu(naechster);
    }
  }

  // --- Import / Reset ----------------------------------------------------
  importieren(rohText: string): void {
    try {
      const daten = JSON.parse(rohText) as Record<string, unknown>;
      const vertragsdaten = (daten['vertragsdaten'] ?? daten) as Record<string, unknown>;
      this.vertragsdaten.store.importieren(vertragsdaten);
      this.importHinweis.set(
        'Daten importiert. Regeln greifen erst wieder bei der nächsten Feldänderung.',
      );
      this.aktiverTab.set('vertragsdaten');
    } catch {
      this.importHinweis.set('Import fehlgeschlagen: ungültiges JSON.');
    }
  }

  zuruecksetzen(): void {
    this.vertragsdaten.store.zuruecksetzen();
    this.deckungen.initialisieren();
    this.aktiverTab.set('vertragsdaten');
    this.importHinweis.set(null);
  }

  // --- Payload ----------------------------------------------------------
  readonly payload = computed(() => ({
    ...this.vertragsdaten.store.werte(),
    deckungen: this.deckungen.payload(),
  }));
}
