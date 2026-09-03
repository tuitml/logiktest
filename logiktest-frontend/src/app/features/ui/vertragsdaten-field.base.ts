import { Directive, inject } from '@angular/core';

import type { FieldId } from '../../core/engine';
import { VertragsdatenStore } from '../../domain/fields/vertragsdaten.store';

/**
 * Gemeinsame Basis für die (bewusst dünnen) Feld-Komponenten des Tabs
 * "Vertragsdaten". Eine konkrete Komponente legt nur ihre `fieldId` fest und
 * verwendet das passende Template (`TEXT_FIELD_TEMPLATE` / `SELECT_FIELD_TEMPLATE`).
 *
 * `display:contents` am Host (`.field-slot`): der `<app-*-field>`-Wrapper belegt
 * im 2-Spalten-Grid selbst KEINE Zelle. Ist das Feld unsichtbar, rendert der
 * innere Wrapper nichts -> keine Grid-Zelle -> nachfolgende Felder rücken auf.
 */
@Directive({ host: { class: 'field-slot' } })
export abstract class VertragsdatenFieldBase {
  protected abstract readonly fieldId: FieldId;
  protected readonly store = inject(VertragsdatenStore).store;

  protected get runtime() {
    return this.store.field(this.fieldId);
  }

  protected change(value: unknown): void {
    this.store.applyUserChange(this.fieldId, value);
  }
}

export const TEXT_FIELD_TEMPLATE =
  `<app-text-field [view]="runtime.view()" (valueChange)="change($event)" />`;

export const SELECT_FIELD_TEMPLATE =
  `<app-select-field [view]="runtime.view()" (valueChange)="change($event)" />`;
