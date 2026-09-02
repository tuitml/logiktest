import { STEUERUNG_AN } from '../../../core/engine';
import type { FeldModul } from '../../../core/engine';
import type { NutzungKontext } from '../deckung.kontext';
import { nutzungsartWertebereich } from './nutzungsart.wertebereich';

export const nutzungsartFeld: FeldModul<string, NutzungKontext> = {
  id: 'nutzungsart',
  label: 'Nutzungsart',
  typ: 'select',
  abhaengigkeiten: [],
  steuerung: () => STEUERUNG_AN,
  wertebereich: nutzungsartWertebereich,
  validierung: (ctx) =>
    ctx.wert<string>('nutzungsart') == null ? ['Nutzungsart ist ein Pflichtfeld.'] : [],
};
