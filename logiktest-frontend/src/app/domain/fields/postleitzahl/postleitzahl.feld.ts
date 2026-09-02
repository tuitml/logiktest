import type { FeldModul } from '../../../core/engine';
import type { VertragsdatenKontext } from '../vertragsdaten.kontext';
import { postleitzahlSteuerung } from './postleitzahl.steuerung';
import {
  postleitzahlAsyncValidierung,
  postleitzahlValidierung,
} from './postleitzahl.validierung';

export const postleitzahlFeld: FeldModul<string, VertragsdatenKontext> = {
  id: 'postleitzahl',
  label: 'Postleitzahl',
  typ: 'text',
  abhaengigkeiten: [],
  steuerung: postleitzahlSteuerung,
  validierung: postleitzahlValidierung,
  asyncValidierung: postleitzahlAsyncValidierung,
};
