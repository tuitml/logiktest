import type { Steuerung } from '../../../core/engine';
import type { VertragsdatenContext } from '../vertragsdaten.context';

/**
 * Nur VRK-berechtigt  -> Feld ausgeblendet und nicht änderbar (Wert ist dann fix "VRK").
 * Sonst               -> sichtbar und änderbar.
 * Relevant ist das Feld immer (der Wert steuert fast alles Weitere).
 */
export function versichererSteuerung(ctx: VertragsdatenContext): Steuerung {
  const nurVrk = ctx.auth.permission() === 'vrk';
  return { sichtbar: !nurVrk, bearbeitbar: !nurVrk, relevant: true };
}
