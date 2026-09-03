import type { FieldModule } from '../../../core/engine';
import type { NutzungContext } from '../deckung.context';
import { nutzungsartField } from './nutzungsart.field';
import { nutzungWertField } from './wert.field';

export const NUTZUNG_FIELDS: ReadonlyArray<FieldModule<any, NutzungContext>> = [
  nutzungsartField,
  nutzungWertField,
];
