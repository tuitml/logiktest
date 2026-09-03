import { computed, inject, Injectable, signal } from '@angular/core';

import { ImportService } from '../../core/backend/import.service';
import { VertragsdatenStore } from '../../domain/fields/vertragsdaten.store';
import { DeckungStore } from '../../domain/deckungen/deckung.store';
import { mappeVorbelegung } from '../../domain/import/import-mapping';
import { TAB_FELDER, type TabId } from './tab-konfiguration';

/**
 * Klammert Vertragsdaten + Deckungen zusammen: aktiver Tab, Weiter-Navigation,
 * Import / Reset und die finale Payload (nur Werte) für das Backend.
 */
@Injectable({ providedIn: 'root' })
export class FormularStore {
  private readonly vertragsdaten = inject(VertragsdatenStore);
  private readonly deckungen = inject(DeckungStore);
  private readonly importDienst = inject(ImportService);

  readonly aktiverTab = signal<TabId>('vertragsdaten');
  readonly importHinweis = signal<string | null>(null);
  readonly importLaeuft = signal(false);

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
  /** Ruft das Backend, mappt die Antwort und belegt alle bekannten Felder vor. */
  async importierenVomBackend(): Promise<void> {
    if (this.importLaeuft()) {
      return;
    }
    this.importLaeuft.set(true);
    this.importHinweis.set(null);
    try {
      const roh = await this.importDienst.ladeVorbelegung();
      const { vertragsdaten, deckungen } = mappeVorbelegung(roh);
      this.vertragsdaten.store.importieren(vertragsdaten);
      this.deckungen.importieren(deckungen);
      this.aktiverTab.set('vertragsdaten');
      this.importHinweis.set(
        'Daten aus dem Backend übernommen. Regeln greifen erst wieder bei der nächsten Feldänderung.',
      );
    } catch {
      this.importHinweis.set('Import fehlgeschlagen: Backend nicht erreichbar.');
    } finally {
      this.importLaeuft.set(false);
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
