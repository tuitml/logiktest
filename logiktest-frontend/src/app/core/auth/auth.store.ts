import { computed, Injectable, signal } from '@angular/core';

import type { AuthLese, Rolle } from '../engine/regel-kontext';

/**
 * Berechtigungen des angemeldeten Benutzers.
 *
 * Kommt in echt aus dem Token; hier fest gesetzt und zur Laufzeit unveränderlich
 * (bis auf den Demo-Umschalter `setzeRollen`, damit man die Regeln ausprobieren kann).
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _rollen = signal<ReadonlyArray<Rolle>>(['RBBER_HUK', 'RBBER_VRK']);

  readonly rollen = this._rollen.asReadonly();
  readonly rollenText = computed(() => this._rollen().join(', ') || '—');

  hatRolle(rolle: Rolle): boolean {
    return this._rollen().includes(rolle);
  }

  hatNurRolle(rolle: Rolle): boolean {
    const r = this._rollen();
    return r.length === 1 && r[0] === rolle;
  }

  hatAlleRollen(...rollen: Rolle[]): boolean {
    const vorhanden = this._rollen();
    return rollen.every((r) => vorhanden.includes(r));
  }

  /** Nur für Demo-Zwecke, um die rollenabhängigen Regeln vorzuführen. */
  setzeRollen(rollen: ReadonlyArray<Rolle>): void {
    this._rollen.set([...rollen]);
  }

  /** Read-only-Sicht für den RegelKontext. */
  lese(): AuthLese {
    return {
      rollen: () => this._rollen(),
      hatRolle: (r) => this.hatRolle(r),
      hatNurRolle: (r) => this.hatNurRolle(r),
      hatAlleRollen: (...r) => this.hatAlleRollen(...r),
    };
  }
}
