import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthStore } from '../../core/auth/auth.store';
import type { Rolle } from '../../core/engine';
import { VersichererFieldComponent } from '../../domain/fields/versicherer/versicherer-field.component';
import { FormularStore } from './formular.store';
import { TABS, type TabId } from './tab-konfiguration';
import { TabVertragsdatenComponent } from './tab-vertragsdaten.component';
import { TabDeckungenComponent } from './tab-deckungen.component';
import { TabErgebnisComponent } from './tab-ergebnis.component';

@Component({
  selector: 'app-formular',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    VersichererFieldComponent,
    TabVertragsdatenComponent,
    TabDeckungenComponent,
    TabErgebnisComponent,
  ],
  templateUrl: './formular.component.html',
  styleUrl: './formular.component.css',
})
export class FormularComponent {
  protected readonly store = inject(FormularStore);
  protected readonly auth = inject(AuthStore);
  protected readonly tabs = TABS;

  protected waehleDatei(ereignis: Event): void {
    const datei = (ereignis.target as HTMLInputElement).files?.[0];
    if (!datei) {
      return;
    }
    void datei.text().then((text) => this.store.importieren(text));
  }

  protected rolleUmschalten(rolle: Rolle): void {
    const aktuell = this.auth.rollen();
    const neu = aktuell.includes(rolle)
      ? aktuell.filter((r) => r !== rolle)
      : [...aktuell, rolle];
    this.auth.setzeRollen(neu);
  }

  protected istTabAktiv(id: TabId): boolean {
    return this.store.aktiverTab() === id;
  }
}
