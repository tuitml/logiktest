import type { SelectOption } from '../../core/engine';
import type { Versicherer } from '../versicherer';
import type { RisikoartId } from './deckung.typen';

export type RisikoartOption = SelectOption<RisikoartId>;

/** Wertebereich der Risikoart je Versicherer (siehe Fachdokumentation / Screenshots). */
export const RISIKOART_KATALOG: Record<Versicherer, ReadonlyArray<RisikoartOption>> = {
  HCR: [
    { wert: '10', label: '10: Fahrer-RS' },
    { wert: '15', label: '15: Großer Verkehrs-RS' },
    { wert: '17', label: '17: Verkehrs-RS' },
    { wert: '19', label: '19: Privat- und Berufs-RS' },
    { wert: '23', label: '23: Privat-, Berufs- und Verkehrs-RS' },
    { wert: '24', label: '24: Mieter-RS' },
    { wert: '25', label: '25: Eigentümer-RS' },
    { wert: '27', label: '27: Rechtsschutz PLUS' },
    { wert: '29', label: '29: Rechtsschutz für alle selbst genutzten Wohneinheiten' },
    { wert: '119', label: '119: RS60 Privat-RS' },
    { wert: '123', label: '123: RS60 Privat- und Verkehrs-RS' },
    { wert: '223', label: '223: Single Privat-, Berufs- und Verkehrs-RS' },
    { wert: '126', label: '126: Rechtsberatung' },
  ],
  VRK: [
    { wert: '200010', label: '200010: Fahrer-RS' },
    { wert: '102015', label: '102015: Großer Verkehrs-RS' },
    { wert: '100017', label: '100017: Verkehrs-RS' },
    { wert: '310019', label: '310019: Privat- und Berufs-RS' },
    { wert: '300023', label: '300023: Privat-, Berufs- und Verkehrs-RS' },
    { wert: '600024', label: '600024: Mieter-RS' },
    { wert: '400025', label: '400025: Eigentümer-RS' },
    { wert: '310027', label: '310027: Rechtsschutz PLUS' },
    { wert: '400029', label: '400029: Rechtsschutz für alle selbst genutzten Wohneinheiten' },
    { wert: '310119', label: '310119: RS60 Privat-RS' },
    { wert: '300123', label: '300123: RS60 Privat- und Verkehrs-RS' },
    { wert: '300223', label: '300223: Single Privat-, Berufs- und Verkehrs-RS' },
    { wert: '310126', label: '310126: Rechtsberatung' },
  ],
  HUK24: [
    { wert: '15', label: '15: Großer Verkehrs-RS' },
    { wert: '17', label: '17: Verkehrs-RS' },
    { wert: '23', label: '23: Privat-, Berufs- und Verkehrs-RS' },
    { wert: '123', label: '123: RS60 Privat- und Verkehrs-RS' },
    { wert: '223', label: '223: Single Privat-, Berufs- und Verkehrs-RS' },
    { wert: '27', label: '27: Rechtsschutz PLUS' },
    { wert: '29', label: '29: Rechtsschutz für alle selbst genutzten Wohneinheiten' },
    { wert: '126', label: '126: Rechtsberatung' },
  ],
};

/** Standard-Risikoart der ersten Deckung je Versicherer. */
export const STANDARD_RISIKOART: Record<Versicherer, RisikoartId> = {
  HCR: '23',
  VRK: '300023',
  HUK24: '17',
};

export function katalogFuer(versicherer: Versicherer | undefined): ReadonlyArray<RisikoartOption> {
  return RISIKOART_KATALOG[versicherer ?? 'HCR'];
}
