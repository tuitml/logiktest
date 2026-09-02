import type { SelectOption } from '../../core/engine';
import type { Einheit, RisikoartId } from './deckung.typen';

export interface NutzungsartOption extends SelectOption<string> {
  readonly einheit: Einheit;
}

/** Wertebereich Nutzungen, wenn die Risikoart der Deckung RA24 (bzw. RA600024) ist. */
const RA24_NUTZUNGEN: ReadonlyArray<NutzungsartOption> = [
  { wert: 'GEWM', label: 'gewerblich genutzte Einheit', einheit: 'BRUTTOJAHRESMIETE' },
  { wert: 'GARM', label: 'Garage Stellplatz', einheit: 'ANZAHL' },
  { wert: 'UBGRM', label: 'unbebautes Grundstück', einheit: 'FLAECHE' },
];

/** Wertebereich Nutzungen, wenn die Risikoart der Deckung RA25 (bzw. RA400025) ist. */
const RA25_NUTZUNGEN: ReadonlyArray<NutzungsartOption> = [
  { wert: 'VMWW', label: 'vermietete Wohneinheit', einheit: 'BRUTTOJAHRESMIETE' },
  { wert: 'GEWG', label: 'gewerblich genutzte Einheit', einheit: 'BRUTTOJAHRESMIETE' },
  { wert: 'GAR', label: 'Garage Stellplatz', einheit: 'ANZAHL' },
  { wert: 'UBGR', label: 'unbebautes Grundstück', einheit: 'FLAECHE' },
  { wert: 'VMEE', label: 'vermietete Eigentumswohnung', einheit: 'BRUTTOJAHRESMIETE' },
];

export function nutzungenFuerRisikoart(
  risikoart: RisikoartId | undefined,
): ReadonlyArray<NutzungsartOption> {
  if (risikoart === '24' || risikoart === '600024') {
    return RA24_NUTZUNGEN;
  }
  if (risikoart === '25' || risikoart === '400025') {
    return RA25_NUTZUNGEN;
  }
  return [];
}

export function einheitFuer(
  risikoart: RisikoartId | undefined,
  nutzungsart: string | undefined,
): Einheit | undefined {
  return nutzungenFuerRisikoart(risikoart).find((n) => n.wert === nutzungsart)?.einheit;
}
