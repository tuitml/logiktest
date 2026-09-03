import type { FieldModule } from '../../../core/engine';
import type { Wagniskennziffer } from '../deckung.types';
import type { FahrzeugContext } from '../deckung.context';
import { wagniskennzifferDatenmanipulation } from './wagniskennziffer.datenmanipulation';
import { wagniskennzifferSteuerung } from './wagniskennziffer.steuerung';
import { wagniskennzifferValidierung } from './wagniskennziffer.validierung';
import { wagniskennzifferWertebereich } from './wagniskennziffer.wertebereich';

export const wagniskennzifferField: FieldModule<Wagniskennziffer, FahrzeugContext> = {
  id: 'wagniskennziffer',
  label: 'Wagniskennziffer',
  type: 'select',
  dependencies: [],
  steuerung: wagniskennzifferSteuerung,
  wertebereich: wagniskennzifferWertebereich,
  datenmanipulation: wagniskennzifferDatenmanipulation,
  validierung: wagniskennzifferValidierung,
};

export const FAHRZEUG_FIELDS: ReadonlyArray<FieldModule<any, FahrzeugContext>> = [wagniskennzifferField];
