import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SelectFieldComponent } from '../../ui/select-field.component';
import type { DeckungRuntime, FahrzeugRuntime } from '../../../domain/deckungen/deckung.runtime';
import type { Wagniskennziffer } from '../../../domain/deckungen/deckung.types';

@Component({
  selector: 'app-fahrzeug-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectFieldComponent],
  template: `
    <div class="subrow">
      <span class="subrow-title">Fahrzeug {{ position() }}</span>
      <app-select-field
        [view]="fahrzeug().wagniskennzifferView()"
        (valueChange)="change($event)"
      />
      @if (deckung().canRemoveFahrzeug()) {
        <button type="button" class="remove" (click)="deckung().removeFahrzeug(fahrzeug())">
          Entfernen
        </button>
      }
    </div>
  `,
})
export class FahrzeugRowComponent {
  readonly deckung = input.required<DeckungRuntime>();
  readonly fahrzeug = input.required<FahrzeugRuntime>();
  readonly position = input.required<number>();

  protected change(value: unknown): void {
    this.fahrzeug().setWagniskennziffer(value as Wagniskennziffer | undefined);
  }
}
