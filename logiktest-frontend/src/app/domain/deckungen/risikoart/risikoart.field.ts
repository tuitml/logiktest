import type { FieldModule } from '../../../core/engine';
import type { DeckungContext } from '../deckung.context';
import type { RisikoartId } from '../deckung.types';
import { risikoartDatenmanipulation } from './risikoart.datenmanipulation';
import { risikoartSteuerung } from './risikoart.steuerung';
import { risikoartValidierung } from './risikoart.validierung';
import { risikoartWertebereich } from './risikoart.wertebereich';

/** "Risikoart" ist fachlich ein eigenes Feld, technisch zugleich die ID der Deckung. */
export const risikoartField: FieldModule<RisikoartId, DeckungContext> = {
  id: 'risikoart',
  label: 'Risikoart',
  type: 'select',
  dependencies: [],
  steuerung: risikoartSteuerung,
  wertebereich: risikoartWertebereich,
  datenmanipulation: risikoartDatenmanipulation,
  validierung: risikoartValidierung,
};
