import { inject, Injectable, Injector } from '@angular/core';

import { FeldStore } from '../../core/engine';
import { AuthStore } from '../../core/auth/auth.store';
import { PlzService } from '../../core/backend/plz.service';
import { TarifService } from '../../core/backend/tarif.service';
import { baueVertragsdatenKontext } from './vertragsdaten.kontext';
import type { VertragsdatenKontext } from './vertragsdaten.kontext';
import { VERTRAGSDATEN_FELDER } from './vertragsdaten.felder';

/**
 * Hält den FeldStore für alle Vertragsdaten-Felder (inkl. Versicherer).
 * Ein einziger Store = eine Source of Truth für diesen Bereich.
 */
@Injectable({ providedIn: 'root' })
export class VertragsdatenStore {
  private readonly auth = inject(AuthStore);
  private readonly injector = inject(Injector);
  private readonly tarifDienst = inject(TarifService);
  private readonly plzDienst = inject(PlzService);

  readonly store = new FeldStore<VertragsdatenKontext>(
    'vertragsdaten',
    VERTRAGSDATEN_FELDER,
    (s) =>
      baueVertragsdatenKontext(s, this.auth.lese(), {
        tarif: this.tarifDienst,
        plz: this.plzDienst,
      }),
    this.injector,
  );

  constructor() {
    this.store.initialisieren();
  }
}
