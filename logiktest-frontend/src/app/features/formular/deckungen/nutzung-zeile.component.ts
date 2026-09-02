import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { SelectFeldComponent } from '../../ui/select-feld.component';
import { TextFeldComponent } from '../../ui/text-feld.component';
import type {
  GrundstueckRuntime,
  NutzungRuntime,
} from '../../../domain/deckungen/deckung.runtime';
import { EINHEIT_LABEL, type RisikoartId } from '../../../domain/deckungen/deckung.typen';
import { einheitFuer } from '../../../domain/deckungen/nutzung-katalog';

@Component({
  selector: 'app-nutzung-zeile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectFeldComponent, TextFeldComponent],
  template: `
    <div class="unterzeile unterzeile--nutzung">
      <span class="unterzeile-titel">Nutzung {{ position() }}</span>
      <app-select-feld
        [view]="nutzung().nutzungsartView()"
        (wertGeaendert)="nutzungsart($event)"
      />
      <div class="wert-mit-einheit">
        <app-text-feld [view]="nutzung().wertView()" (wertGeaendert)="wert($event)" />
        <span class="einheit">{{ einheitLabel() }}</span>
      </div>
      @if (grundstueck().darfNutzungEntfernen()) {
        <button type="button" class="entfernen" (click)="grundstueck().nutzungEntfernen(nutzung())">
          Entfernen
        </button>
      }
    </div>
  `,
  styles: `
    .wert-mit-einheit {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
    }
    .einheit {
      padding-bottom: 0.5rem;
      font-size: 0.8rem;
      color: #4a6572;
      white-space: nowrap;
    }
  `,
})
export class NutzungZeileComponent {
  readonly grundstueck = input.required<GrundstueckRuntime>();
  readonly nutzung = input.required<NutzungRuntime>();
  readonly position = input.required<number>();
  readonly risikoart = input.required<RisikoartId | undefined>();

  protected readonly einheitLabel = computed(() => {
    const einheit = einheitFuer(this.risikoart(), this.nutzung().nutzungsartWert());
    return einheit ? EINHEIT_LABEL[einheit] : '';
  });

  protected nutzungsart(wert: unknown): void {
    this.nutzung().setzeNutzungsart(wert as string | undefined);
  }
  protected wert(wert: unknown): void {
    this.nutzung().setzeWert(wert as number | undefined);
  }
}
