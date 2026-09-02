import { STEUERUNG_AN } from '../../../core/engine';
import type { Steuerung } from '../../../core/engine';
import type { DeckungKontext } from '../deckung.kontext';

/** Immer sichtbar, immer veränderbar. */
export function risikoartSteuerung(_ctx: DeckungKontext): Steuerung {
  return STEUERUNG_AN;
}
