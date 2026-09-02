import type { NutzungKontext } from '../deckung.kontext';
import { nutzungenFuerRisikoart, type NutzungsartOption } from '../nutzung-katalog';

/** Abhängig von der Risikoart der übergeordneten Deckung (RA24- vs. RA25-Gruppe). */
export function nutzungsartWertebereich(ctx: NutzungKontext): ReadonlyArray<NutzungsartOption> {
  return nutzungenFuerRisikoart(ctx.risikoartDerDeckung());
}
