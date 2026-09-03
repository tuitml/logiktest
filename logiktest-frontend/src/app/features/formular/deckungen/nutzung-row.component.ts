import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { SelectFieldComponent } from '../../ui/select-field.component';
import { TextFieldComponent } from '../../ui/text-field.component';
import type {
  GrundstueckRuntime,
  NutzungRuntime,
} from '../../../domain/deckungen/deckung.runtime';
import { EINHEIT_LABEL, type RisikoartId } from '../../../domain/deckungen/deckung.types';
import { einheitFor } from '../../../domain/deckungen/nutzung-catalog';

@Component({
  selector: 'app-nutzung-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectFieldComponent, TextFieldComponent],
  template: `
    <div class="subrow subrow--nutzung">
      <span class="subrow-title">Nutzung {{ position() }}</span>
      <app-select-field
        [view]="nutzung().nutzungsartView()"
        (valueChange)="changeNutzungsart($event)"
      />
      <div class="value-with-unit">
        <app-text-field [view]="nutzung().wertView()" (valueChange)="changeWert($event)" />
        <span class="unit">{{ unitLabel() }}</span>
      </div>
      @if (grundstueck().canRemoveNutzung()) {
        <button type="button" class="remove" (click)="grundstueck().removeNutzung(nutzung())">
          Entfernen
        </button>
      }
    </div>
  `,
  styles: `
    .value-with-unit {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
    }
    .unit {
      padding-bottom: 0.5rem;
      font-size: 0.8rem;
      color: #4a6572;
      white-space: nowrap;
    }
  `,
})
export class NutzungRowComponent {
  readonly grundstueck = input.required<GrundstueckRuntime>();
  readonly nutzung = input.required<NutzungRuntime>();
  readonly position = input.required<number>();
  readonly risikoart = input.required<RisikoartId | undefined>();

  protected readonly unitLabel = computed(() => {
    const einheit = einheitFor(this.risikoart(), this.nutzung().nutzungsartValue());
    return einheit ? EINHEIT_LABEL[einheit] : '';
  });

  protected changeNutzungsart(value: unknown): void {
    this.nutzung().setNutzungsart(value as string | undefined);
  }
  protected changeWert(value: unknown): void {
    this.nutzung().setWert(value as number | undefined);
  }
}
