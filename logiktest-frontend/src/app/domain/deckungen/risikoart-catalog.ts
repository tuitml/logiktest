import type { SelectOption } from '../../core/engine';
import type { Versicherer } from '../versicherer';
import type { RisikoartId } from './deckung.types';

export type RisikoartOption = SelectOption<RisikoartId>;

/** Wertebereich der Risikoart je Versicherer (siehe Fachdokumentation / Screenshots). */
export const RISIKOART_CATALOG: Record<Versicherer, ReadonlyArray<RisikoartOption>> = {
  HCR: [
    { value: '10', label: '10: Fahrer-RS' },
    { value: '15', label: '15: Großer Verkehrs-RS' },
    { value: '17', label: '17: Verkehrs-RS' },
    { value: '19', label: '19: Privat- und Berufs-RS' },
    { value: '23', label: '23: Privat-, Berufs- und Verkehrs-RS' },
    { value: '24', label: '24: Mieter-RS' },
    { value: '25', label: '25: Eigentümer-RS' },
    { value: '27', label: '27: Rechtsschutz PLUS' },
    { value: '29', label: '29: Rechtsschutz für alle selbst genutzten Wohneinheiten' },
    { value: '119', label: '119: RS60 Privat-RS' },
    { value: '123', label: '123: RS60 Privat- und Verkehrs-RS' },
    { value: '223', label: '223: Single Privat-, Berufs- und Verkehrs-RS' },
    { value: '126', label: '126: Rechtsberatung' },
  ],
  VRK: [
    { value: '200010', label: '200010: Fahrer-RS' },
    { value: '102015', label: '102015: Großer Verkehrs-RS' },
    { value: '100017', label: '100017: Verkehrs-RS' },
    { value: '310019', label: '310019: Privat- und Berufs-RS' },
    { value: '300023', label: '300023: Privat-, Berufs- und Verkehrs-RS' },
    { value: '600024', label: '600024: Mieter-RS' },
    { value: '400025', label: '400025: Eigentümer-RS' },
    { value: '310027', label: '310027: Rechtsschutz PLUS' },
    { value: '400029', label: '400029: Rechtsschutz für alle selbst genutzten Wohneinheiten' },
    { value: '310119', label: '310119: RS60 Privat-RS' },
    { value: '300123', label: '300123: RS60 Privat- und Verkehrs-RS' },
    { value: '300223', label: '300223: Single Privat-, Berufs- und Verkehrs-RS' },
    { value: '310126', label: '310126: Rechtsberatung' },
  ],
  HUK24: [
    { value: '15', label: '15: Großer Verkehrs-RS' },
    { value: '17', label: '17: Verkehrs-RS' },
    { value: '23', label: '23: Privat-, Berufs- und Verkehrs-RS' },
    { value: '123', label: '123: RS60 Privat- und Verkehrs-RS' },
    { value: '223', label: '223: Single Privat-, Berufs- und Verkehrs-RS' },
    { value: '27', label: '27: Rechtsschutz PLUS' },
    { value: '29', label: '29: Rechtsschutz für alle selbst genutzten Wohneinheiten' },
    { value: '126', label: '126: Rechtsberatung' },
  ],
};

/** Standard-Risikoart der ersten Deckung je Versicherer. */
export const DEFAULT_RISIKOART: Record<Versicherer, RisikoartId> = {
  HCR: '23',
  VRK: '300023',
  HUK24: '17',
};

export function catalogFor(versicherer: Versicherer | undefined): ReadonlyArray<RisikoartOption> {
  return RISIKOART_CATALOG[versicherer ?? 'HCR'];
}
