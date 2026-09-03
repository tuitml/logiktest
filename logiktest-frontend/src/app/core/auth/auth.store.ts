import { computed, Injectable, signal } from '@angular/core';

import type { AuthReader, MandantPermission } from '../engine/rule-context';

/** Einzelne Mandanten-Claims aus dem Token. */
export type MandantClaim = 'huk' | 'vrk';

/**
 * Berechtigungen des angemeldeten Benutzers.
 *
 * Im echten System wird `mandantPermission` aus dem Token abgeleitet und ändert
 * sich zur Laufzeit nicht. Dieser Stub leitet es aus einem settable Signal ab,
 * damit man die berechtigungsabhängigen Regeln vorführen kann (`setClaims`).
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _claims = signal<ReadonlyArray<MandantClaim>>(['huk', 'vrk']);

  readonly mandantPermission = computed<MandantPermission>(() => {
    const claims = this._claims();
    const huk = claims.includes('huk');
    const vrk = claims.includes('vrk');
    if (huk && vrk) return 'both';
    if (huk) return 'huk';
    if (vrk) return 'vrk';
    return 'none';
  });

  /** Nur im Stub für Demo-Zwecke – der echte Store hat keinen Setter. */
  setClaims(claims: ReadonlyArray<MandantClaim>): void {
    this._claims.set([...claims]);
  }

  /** Read-only-Sicht für den RuleContext. */
  reader(): AuthReader {
    return { permission: () => this.mandantPermission() };
  }
}
