import type { FeldModul } from '../../../core/engine';
import type { Wagniskennziffer } from '../deckung.typen';
import type { FahrzeugKontext } from '../deckung.kontext';
import { wagniskennzifferDatenmanipulation } from './wagniskennziffer.datenmanipulation';
import { wagniskennzifferSteuerung } from './wagniskennziffer.steuerung';
import { wagniskennzifferValidierung } from './wagniskennziffer.validierung';
import { wagniskennzifferWertebereich } from './wagniskennziffer.wertebereich';

export const wagniskennzifferFeld: FeldModul<Wagniskennziffer, FahrzeugKontext> = {
  id: 'wagniskennziffer',
  label: 'Wagniskennziffer',
  typ: 'select',
  abhaengigkeiten: [],
  steuerung: wagniskennzifferSteuerung,
  wertebereich: wagniskennzifferWertebereich,
  datenmanipulation: wagniskennzifferDatenmanipulation,
  validierung: wagniskennzifferValidierung,
};

export const FAHRZEUG_FELDER: ReadonlyArray<FeldModul<any, FahrzeugKontext>> = [wagniskennzifferFeld];
