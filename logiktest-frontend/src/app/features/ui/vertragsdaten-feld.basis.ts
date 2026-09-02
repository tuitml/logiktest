import { Directive, inject } from '@angular/core';

import type { FeldId } from '../../core/engine';
import { VertragsdatenStore } from '../../domain/fields/vertragsdaten.store';

/**
 * Gemeinsame Basis für die (bewusst dünnen) Feld-Komponenten des Tabs
 * "Vertragsdaten". Eine konkrete Komponente legt nur ihre `feldId` fest und
 * verwendet das passende Template (`TEXT_FELD_TEMPLATE` oder `SELECT_FELD_TEMPLATE`).
 *
 * `display:contents` am Host (`.feld-slot`): der `<app-*-field>`-Wrapper belegt im
 * 2-Spalten-Grid selbst KEINE Zelle. Ist das Feld unsichtbar, rendert der innere
 * Wrapper nichts -> keine Grid-Zelle -> nachfolgende Felder rücken auf.
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

export const TEXT_FELD_TEMPLATE =
  `<app-text-feld [view]="rt.view()" (wertGeaendert)="aendern($event)" />`;

export const SELECT_FELD_TEMPLATE =
  `<app-select-feld [view]="rt.view()" (wertGeaendert)="aendern($event)" />`;
