import type { SelectOption } from '../../core/engine';
import type { Einheit, RisikoartId } from './deckung.types';

export interface NutzungsartOption extends SelectOption<string> {
  readonly einheit: Einheit;
}

/** Wertebereich Nutzungen, wenn die Risikoart der Deckung RA24 (bzw. RA600024) ist. */
const RA24_NUTZUNGEN: ReadonlyArray<NutzungsartOption> = [
  { value: 'GEWM', label: 'gewerblich genutzte Einheit', einheit: 'BRUTTOJAHRESMIETE' },
  { value: 'GARM', label: 'Garage Stellplatz', einheit: 'ANZAHL' },
  { value: 'UBGRM', label: 'unbebautes Grundstück', einheit: 'FLAECHE' },
];

/** Wertebereich Nutzungen, wenn die Risikoart der Deckung RA25 (bzw. RA400025) ist. */
const RA25_NUTZUNGEN: ReadonlyArray<NutzungsartOption> = [
  { value: 'VMWW', label: 'vermietete Wohneinheit', einheit: 'BRUTTOJAHRESMIETE' },
  { value: 'GEWG', label: 'gewerblich genutzte Einheit', einheit: 'BRUTTOJAHRESMIETE' },
  { value: 'GAR', label: 'Garage Stellplatz', einheit: 'ANZAHL' },
  { value: 'UBGR', label: 'unbebautes Grundstück', einheit: 'FLAECHE' },
  { value: 'VMEE', label: 'vermietete Eigentumswohnung', einheit: 'BRUTTOJAHRESMIETE' },
];

export function nutzungenForRisikoart(
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

export function einheitFor(
  risikoart: RisikoartId | undefined,
  nutzungsart: string | undefined,
): Einheit | undefined {
  return nutzungenForRisikoart(risikoart).find((n) => n.value === nutzungsart)?.einheit;
}
