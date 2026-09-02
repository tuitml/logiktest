import type { Steuerung } from '../../../core/engine';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';

/**
 * Nur Rolle RBBER_VRK  -> Feld ausgeblendet und nicht änderbar (Wert ist dann fix "VRK").
 * Sonst                -> sichtbar und änderbar.
 * Relevant ist das Feld immer (der Wert steuert fast alles Weitere).
 */
export function versichererSteuerung(ctx: VertragsdatenKontext): Steuerung {
  const nurVrk = ctx.auth.hatNurRolle('RBBER_VRK');
  return { sichtbar: !nurVrk, bearbeitbar: !nurVrk, relevant: true };
}
