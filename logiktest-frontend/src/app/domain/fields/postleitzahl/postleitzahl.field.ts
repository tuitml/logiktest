import type { FieldModule } from '../../../core/engine';
import type { VertragsdatenContext } from '../vertragsdaten.context';
import { postleitzahlSteuerung } from './postleitzahl.steuerung';
import {
  postleitzahlAsyncValidierung,
  postleitzahlValidierung,
} from './postleitzahl.validierung';

export const postleitzahlField: FieldModule<string, VertragsdatenContext> = {
  id: 'postleitzahl',
  label: 'Postleitzahl',
  type: 'text',
  dependencies: [],
  steuerung: postleitzahlSteuerung,
  validierung: postleitzahlValidierung,
  asyncValidierung: postleitzahlAsyncValidierung,
};
