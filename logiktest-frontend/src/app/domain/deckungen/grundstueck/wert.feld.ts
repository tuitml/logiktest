import { BEHALTEN, leeren, STEUERUNG_AN } from '../../../core/engine';
import type { FeldModul } from '../../../core/engine';
import type { NutzungKontext } from '../deckung.kontext';

/**
 * Der Wert der Nutzung. Die Einheit (Bruttojahresmiete / Anzahl / Fläche) ergibt
 * sich aus der Nutzungsart und wird in der Oberfläche angezeigt.
 *
 * Datenmanipulation: ohne Nutzungsart kein Wert. Das eigentliche "Zurücksetzen
 * bei Nutzungsart-Wechsel" erledigt die NutzungRuntime (sie kennt den vorherigen
 * Wert), damit ein bewusst eingegebener Wert nicht bei jedem Durchlauf verschwindet.
 */
export const nutzungWertFeld: FeldModul<number, NutzungKontext> = {
  id: 'wert',
  label: 'Wert',
  typ: 'zahl',
  abhaengigkeiten: ['nutzungsart'],
  steuerung: () => STEUERUNG_AN,
  datenmanipulation: (ctx) => (ctx.nutzungsart() == null ? leeren() : BEHALTEN),
  validierung: (ctx) => {
    const wert = ctx.wert<number>('wert');
    if (wert == null) {
      return ['Wert ist ein Pflichtfeld.'];
    }
    return wert <= 0 ? ['Wert muss größer als 0 sein.'] : [];
  },
};
