import { STEUERUNG_AN } from '../../../core/engine';
import type { FieldModule } from '../../../core/engine';
import type { NutzungContext } from '../deckung.context';
import { nutzungsartWertebereich } from './nutzungsart.wertebereich';

export const nutzungsartField: FieldModule<string, NutzungContext> = {
  id: 'nutzungsart',
  label: 'Nutzungsart',
  type: 'select',
  dependencies: [],
  steuerung: () => STEUERUNG_AN,
  wertebereich: nutzungsartWertebereich,
  validierung: (ctx) =>
    ctx.value<string>('nutzungsart') == null ? ['Nutzungsart ist ein Pflichtfeld.'] : [],
};
