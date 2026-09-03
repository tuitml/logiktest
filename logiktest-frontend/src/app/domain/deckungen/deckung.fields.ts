import type { FieldModule } from '../../core/engine';
import type { DeckungContext } from './deckung.context';
import { risikoartField } from './risikoart/risikoart.field';
import { rabattField } from './rabatt/rabatt.field';
import { zuschlagField } from './zuschlag/zuschlag.field';

/** Die Felder EINER Deckung. Fahrzeuge/Grundstücke sind eigene (verschachtelte) Strukturen. */
export const DECKUNG_FIELDS: ReadonlyArray<FieldModule<any, DeckungContext>> = [
  risikoartField,
  rabattField,
  zuschlagField,
];
