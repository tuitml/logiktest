import type { FeldModul } from '../../../core/engine';
import type { DeckungKontext } from '../deckung.kontext';
import type { RisikoartId } from '../deckung.typen';
import { risikoartDatenmanipulation } from './risikoart.datenmanipulation';
import { risikoartSteuerung } from './risikoart.steuerung';
import { risikoartValidierung } from './risikoart.validierung';
import { risikoartWertebereich } from './risikoart.wertebereich';

/** "Risikoart" ist fachlich ein eigenes Feld, technisch zugleich die ID der Deckung. */
export const risikoartFeld: FeldModul<RisikoartId, DeckungKontext> = {
  id: 'risikoart',
  label: 'Risikoart',
  typ: 'select',
  abhaengigkeiten: [],
  steuerung: risikoartSteuerung,
  wertebereich: risikoartWertebereich,
  datenmanipulation: risikoartDatenmanipulation,
  validierung: risikoartValidierung,
};
