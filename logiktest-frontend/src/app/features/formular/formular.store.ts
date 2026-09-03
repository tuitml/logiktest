import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { ImportService } from '../../core/backend/import.service';
import { VertragsdatenStore } from '../../domain/fields/vertragsdaten.store';
import { DeckungStore } from '../../domain/deckungen/deckung.store';
import { mapPrefill } from '../../domain/import/import-mapping';
import { TAB_FIELDS, type TabId } from './tab-config';

/**
 * Klammert Vertragsdaten + Deckungen zusammen: aktiver Tab, Weiter-Navigation,
 * Import / Reset und die finale Payload (nur Werte) für das Backend.
 */
@Injectable({ providedIn: 'root' })
export class FormularStore {
  private readonly vertragsdaten = inject(VertragsdatenStore);
  private readonly deckungen = inject(DeckungStore);
  private readonly importService = inject(ImportService);

  readonly activeTab = signal<TabId>('vertragsdaten');
  readonly importHint = signal<string | null>(null);
  readonly importRunning = signal(false);

  readonly vertragsdatenValid = computed(() =>
    TAB_FIELDS.vertragsdaten.every((id) => this.vertragsdaten.store.field(id).gueltig()),
  );
  readonly deckungenValid = computed(() => this.deckungen.valid());

  constructor() {
    // Minimales Log: bei jeder Änderung an Vertragsdaten oder Deckungen alle Werte kurz ausgeben.
    effect(() => {
      const vertragsdaten = Object.fromEntries(
        this.vertragsdaten.store.allFields().map((f) => [f.module.id, f.value()]),
      );
      console.log('[Formular]', { vertragsdaten, deckungen: this.deckungen.payload() });
    });
  }

  /** Darf zu diesem Tab gewechselt werden? Voraussetzung: alle vorherigen Tabs gültig. */
  canSwitchTo(tab: TabId): boolean {
    switch (tab) {
      case 'vertragsdaten':
        return true;
      case 'deckungen':
        return this.vertragsdatenValid();
      case 'ergebnis':
        return this.vertragsdatenValid() && this.deckungenValid();
    }
  }

  switchTo(tab: TabId): void {
    if (this.canSwitchTo(tab)) {
      this.activeTab.set(tab);
    }
  }

  next(): void {
    const order: TabId[] = ['vertragsdaten', 'deckungen', 'ergebnis'];
    const nextTab = order[order.indexOf(this.activeTab()) + 1];
    if (nextTab) {
      this.switchTo(nextTab);
    }
  }

  // --- Import / Reset ----------------------------------------------------
  /** Ruft das Backend, mappt die Antwort und belegt alle bekannten Felder vor. */
  async importFromBackend(): Promise<void> {
    if (this.importRunning()) {
      return;
    }
    this.importRunning.set(true);
    this.importHint.set(null);
    try {
      const raw = await this.importService.loadPrefill();
      const { vertragsdaten, deckungen } = mapPrefill(raw);
      this.vertragsdaten.store.applyImport(vertragsdaten);
      this.deckungen.applyImport(deckungen);
      this.activeTab.set('vertragsdaten');
      this.importHint.set(
        'Daten aus dem Backend übernommen. Regeln greifen erst wieder bei der nächsten Feldänderung.',
      );
    } catch {
      this.importHint.set('Import fehlgeschlagen: Backend nicht erreichbar.');
    } finally {
      this.importRunning.set(false);
    }
  }

  reset(): void {
    this.vertragsdaten.store.initialize();
    this.deckungen.initialize();
    this.activeTab.set('vertragsdaten');
    this.importHint.set(null);
  }

  /**
   * Nur für den Demo-Umschalter der Mandanten-Berechtigung: im echten System
   * kommt die Berechtigung fix aus dem Token. Ändert man sie im Stub, muss der
   * Zustand so nachgezogen werden, als wäre die App damit frisch gestartet.
   */
  refreshPermission(): void {
    this.vertragsdaten.store.applyRules();
    this.deckungen.initialize();
  }

  // --- Payload ----------------------------------------------------------
  readonly payload = computed(() => ({
    ...this.vertragsdaten.store.values(),
    deckungen: this.deckungen.payload(),
  }));
}
