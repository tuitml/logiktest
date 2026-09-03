import { Injectable } from '@angular/core';

/**
 * Rohform der Backend-Vorbelegung. Bewusst locker typisiert – die Anwendung
 * mappt daraus nur die Felder, die sie kennt (siehe `import-mapping.ts`),
 * alles andere wird ignoriert.
 */
export interface BackendVorbelegung {
  readonly [feld: string]: unknown;
  readonly deckungen?: ReadonlyArray<BackendDeckung>;
}

export interface BackendDeckung {
  readonly [feld: string]: unknown;
  readonly risikoart?: string;
  readonly rabatt?: number;
  readonly zuschlag?: number;
  readonly fahrzeuge?: ReadonlyArray<Record<string, unknown>>;
  readonly grundstuecke?: ReadonlyArray<Record<string, unknown>>;
}

/** Beispiel-Antwort des Backends (wie im echten System per HTTP käme). */
const BEISPIEL_DATENSATZ: BackendVorbelegung = {
  mandant: 'VRK',
  beginn: '2026-10-25',
  tarifgruppe: 'NICHT_OEFFENTLICHER_DIENST',
  zahlungsweise: 'JAEHRLICH',
  sbStaffel: 'SB250',
  vorschaden: 'NICHT_VORHANDEN',
  tarif: 'N1826',
  arb: 2018,
  postleitzahl: '15236',
  steuer: 19,
  sondertarif: 'KEIN_SONDERTARIF',
  pfarrvereinnummer: 'KEINE_VORHANDEN',
  berufsklasse: 'MITARBEITER_SOZIALER_EINRICHTUNGEN',
  lebenssituation: 'KEINE_AUSWAHL',
  preisformelId: '',
  arbAenderungsdatum: null,
  geburtsdatum: '1998-08-05',
  mitversichertePersonSelbststaendig: 'NEIN',
  zahlungsart: 'KEINE_ANGABE',
  deckungen: [
    {
      deckungId: 1,
      risikoart: 'RA_300023',
      rabatt: 0.0,
      zuschlag: 0.0,
      fahrzeuge: [],
      grundstuecke: [],
    },
  ],
};

/**
 * Stub für den Backend-Aufruf, der die Feld-Vorbelegung liefert.
 * (Im echten System ein HTTP-GET; hier ein verzögertes Promise.)
 */
@Injectable({ providedIn: 'root' })
export class ImportService {
  ladeVorbelegung(): Promise<BackendVorbelegung> {
    return new Promise((aufloesen) => {
      setTimeout(() => aufloesen(BEISPIEL_DATENSATZ), 400);
    });
  }
}
