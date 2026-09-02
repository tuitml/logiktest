import type { FeldModul } from '../../core/engine';
import type { DeckungKontext } from './deckung.kontext';
import { risikoartFeld } from './risikoart/risikoart.feld';
import { rabattFeld } from './rabatt/rabatt.feld';
import { zuschlagFeld } from './zuschlag/zuschlag.feld';

/** Die Felder EINER Deckung. Fahrzeuge/Grundstücke sind eigene (verschachtelte) Strukturen. */
export const DECKUNG_FELDER: ReadonlyArray<FeldModul<any, DeckungKontext>> = [
  risikoartFeld,
  rabattFeld,
  zuschlagFeld,
];
