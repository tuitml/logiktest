import type { FeldModul } from '../../../core/engine';
import type { NutzungKontext } from '../deckung.kontext';
import { nutzungsartFeld } from './nutzungsart.feld';
import { nutzungWertFeld } from './wert.feld';

export const NUTZUNG_FELDER: ReadonlyArray<FeldModul<any, NutzungKontext>> = [
  nutzungsartFeld,
  nutzungWertFeld,
];
