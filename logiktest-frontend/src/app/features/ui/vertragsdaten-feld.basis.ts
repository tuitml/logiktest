import { Directive, inject } from '@angular/core';

import type { FeldId } from '../../core/engine';
import { VertragsdatenStore } from '../../domain/fields/vertragsdaten.store';

/**
 * Gemeinsame Basis für die (bewusst dünnen) Feld-Komponenten des Tabs
 * "Vertragsdaten". Eine konkrete Komponente legt nur ihre `feldId` fest und
 * verwendet `FELD_TEMPLATE`.
 */
@Directive({ host: { class: 'feld-slot' } })
export abstract class VertragsdatenFeldBasis {
  protected abstract readonly feldId: FeldId;
  protected readonly store = inject(VertragsdatenStore).store;

  protected get rt() {
    return this.store.feld(this.feldId);
  }

  protected aendern(wert: unknown): void {
    this.store.benutzerAenderung(this.feldId, wert);
  }
}

/** Für alle Feld-Komponenten identisch. */
export const FELD_TEMPLATE =
  `<app-feld-host [view]="rt.view()" (wertGeaendert)="aendern($event)" />`;
