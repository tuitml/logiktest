import { computed, Directive, input, output } from '@angular/core';

import type { FeldView } from '../../core/engine';

/**
 * Gemeinsame Basis für `TextFeldComponent` und `SelectFeldComponent`:
 * beide binden genau EIN `view()`-Objekt und melden Änderungen über
 * `wertGeaendert`. `display:contents` am Host (`.feld-slot`) sorgt dafür, dass
 * ein unsichtbares Feld keine Grid-Zelle belegt.
 */
@Directive({ host: { class: 'feld-slot' } })
export abstract class FeldWrapperBasis {
  readonly view = input.required<FeldView>();
  readonly wertGeaendert = output<unknown>();

  protected readonly hatFehler = computed(() => this.view().fehler.length > 0);

  protected stringify(wert: unknown): string {
    return wert == null ? '' : String(wert);
  }
}
