import { mappeVorbelegung } from './import-mapping';

const ROH = {
  mandant: 'VRK',
  beginn: '2026-10-25',
  tarifgruppe: 'NICHT_OEFFENTLICHER_DIENST',
  sbStaffel: 'SB250',
  tarif: 'N1826',
  arb: 2018,
  postleitzahl: '15236',
  steuer: 19,
  berufsklasse: 'MITARBEITER_SOZIALER_EINRICHTUNGEN',
  lebenssituation: 'KEINE_AUSWAHL',
  preisformelId: '',
  geburtsdatum: '1998-08-05',
  deckungen: [
    { deckungId: 1, risikoart: 'RA_300023', rabatt: 0, zuschlag: 0, fahrzeuge: [], grundstuecke: [] },
  ],
};

describe('mappeVorbelegung', () => {
  it('mappt bekannte Vertragsdaten-Felder und ignoriert alles Unbekannte', () => {
    const { vertragsdaten } = mappeVorbelegung(ROH);
    expect(vertragsdaten).toEqual({
      versicherer: 'VRK',
      tarifgruppe: 'NICHT_OED',
      sbStaffel: 250,
      tarif: 'N1826',
      arb: 2018,
      postleitzahl: '15236',
      berufsklasse: 'MITARBEITER_SOZIALE_EINRICHTUNGEN',
    });
  });

  it('lässt Felder ohne verwertbaren Wert weg (KEINE_AUSWAHL / leerer String)', () => {
    const { vertragsdaten } = mappeVorbelegung(ROH);
    expect('lebenssituation' in vertragsdaten).toBe(false);
    expect('preisstand' in vertragsdaten).toBe(false);
  });

  it('mappt Deckungen und entfernt das RA_-Präfix der Risikoart', () => {
    const { deckungen } = mappeVorbelegung(ROH);
    expect(deckungen).toEqual([
      { risikoart: '300023', rabatt: 0, zuschlag: 0, fahrzeuge: [], grundstuecke: [] },
    ]);
  });
});
