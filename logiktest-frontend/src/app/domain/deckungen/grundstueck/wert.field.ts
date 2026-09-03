import { KEEP, STEUERUNG_AN } from '../../../core/engine';
import type { FieldModule } from '../../../core/engine';
import type { NutzungContext } from '../deckung.context';

/**
 * Der Wert der Nutzung. Die Einheit (Bruttojahresmiete / Anzahl / Fläche) ergibt
 * sich aus der Nutzungsart und wird in der Oberfläche angezeigt.
 *
 * Datenmanipulation: ohne Nutzungsart kein Wert. Das eigentliche "Zurücksetzen
 * bei Nutzungsart-Wechsel" erledigt die NutzungRuntime (sie kennt den vorherigen
 * Wert), damit ein bewusst eingegebener Wert nicht bei jedem Durchlauf verschwindet.
 */
export const nutzungWertField: FieldModule<number, NutzungContext> = {
  id: 'wert',
  label: 'Wert',
  type: 'zahl',
  dependencies: ['nutzungsart'],
  steuerung: () => STEUERUNG_AN,
  datenmanipulation: (ctx) => (ctx.nutzungsart() == null ? undefined : KEEP),
  validierung: (ctx) => {
    const value = ctx.value<number>('wert');
    if (value == null) {
      return ['Wert ist ein Pflichtfeld.'];
    }
    return value <= 0 ? ['Wert muss größer als 0 sein.'] : [];
  },
};
