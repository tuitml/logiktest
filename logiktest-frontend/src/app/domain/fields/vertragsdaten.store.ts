import { inject, Injectable, Injector } from '@angular/core';

import { FieldStore } from '../../core/engine';
import { AuthStore } from '../../core/auth/auth.store';
import { PlzService } from '../../core/backend/plz.service';
import { TarifService } from '../../core/backend/tarif.service';
import { buildVertragsdatenContext } from './vertragsdaten.context';
import type { VertragsdatenContext } from './vertragsdaten.context';
import { VERTRAGSDATEN_FIELDS } from './vertragsdaten.fields';

/**
 * Hält den FieldStore für alle Vertragsdaten-Felder (inkl. Versicherer).
 * Ein einziger Store = eine Source of Truth für diesen Bereich.
 */
@Injectable({ providedIn: 'root' })
export class VertragsdatenStore {
  private readonly auth = inject(AuthStore);
  private readonly injector = inject(Injector);
  private readonly tarifService = inject(TarifService);
  private readonly plzService = inject(PlzService);

  readonly store = new FieldStore<VertragsdatenContext>(
    VERTRAGSDATEN_FIELDS,
    (s) =>
      buildVertragsdatenContext(s, this.auth.reader(), {
        tarif: this.tarifService,
        plz: this.plzService,
      }),
    this.injector,
  );

  constructor() {
    this.store.initialize();
  }
}
