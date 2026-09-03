import type { NutzungContext } from '../deckung.context';
import { nutzungenForRisikoart, type NutzungsartOption } from '../nutzung-catalog';

/** Abhängig von der Risikoart der übergeordneten Deckung (RA24- vs. RA25-Gruppe). */
export function nutzungsartWertebereich(ctx: NutzungContext): ReadonlyArray<NutzungsartOption> {
  return nutzungenForRisikoart(ctx.deckungRisikoart());
}
