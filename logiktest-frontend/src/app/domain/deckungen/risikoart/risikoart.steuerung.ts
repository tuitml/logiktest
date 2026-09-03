import { STEUERUNG_AN } from '../../../core/engine';
import type { Steuerung } from '../../../core/engine';
import type { DeckungContext } from '../deckung.context';

/** Immer sichtbar, immer veränderbar. */
export function risikoartSteuerung(_ctx: DeckungContext): Steuerung {
  return STEUERUNG_AN;
}
