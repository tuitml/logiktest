import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { FormularStore } from './formular.store';

/** Zeigt die zusammengeführte Payload (nur Werte), die ans Backend ginge. */
@Component({
  selector: 'app-tab-ergebnis',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="tab-heading">Ergebnis</h2>
    <p class="result-info">Diese Daten würden an das Backend übertragen:</p>
    <pre class="result-json">{{ json() }}</pre>
  `,
  styles: `
    .result-info {
      color: #4a6572;
      margin: 0 0 0.75rem;
    }
    .result-json {
      background: #0f2c3f;
      color: #d6f0f7;
      padding: 1rem;
      border-radius: 8px;
      overflow: auto;
      font-size: 0.8rem;
      line-height: 1.5;
    }
  `,
})
export class TabErgebnisComponent {
  private readonly store = inject(FormularStore);
  protected readonly json = computed(() => JSON.stringify(this.store.payload(), null, 2));
}
