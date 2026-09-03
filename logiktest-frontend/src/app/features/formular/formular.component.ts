import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthStore, type MandantClaim } from '../../core/auth/auth.store';
import { VersichererFieldComponent } from '../../domain/fields/versicherer/versicherer-field.component';
import { FormularStore } from './formular.store';
import { TABS, type TabId } from './tab-config';
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

  /** Demo (nur Stub): Mandanten-Berechtigung umschalten. */
  protected readonly demoLevels: ReadonlyArray<{ label: string; claims: MandantClaim[] }> = [
    { label: 'HUK', claims: ['huk'] },
    { label: 'VRK', claims: ['vrk'] },
    { label: 'HUK + VRK', claims: ['huk', 'vrk'] },
  ];

  protected setPermission(claims: MandantClaim[]): void {
    this.auth.setClaims(claims);
    this.store.refreshPermission();
  }

  protected isLevelActive(claims: MandantClaim[]): boolean {
    const target = [...claims].sort().join(',');
    const map: Record<string, string> = { huk: 'huk', vrk: 'vrk', both: 'huk,vrk', none: '' };
    return map[this.auth.mandantPermission()] === target;
  }

  protected isTabActive(id: TabId): boolean {
    return this.store.activeTab() === id;
  }
}
