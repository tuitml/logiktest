import { KEEP } from '../../../core/engine';
import { fakeContext } from '../../testing/fake-context';
import { versichererDatenmanipulation } from './versicherer.datenmanipulation';
import { versichererSteuerung } from './versicherer.steuerung';
import { versichererWertebereich } from './versicherer.wertebereich';

describe('Versicherer – abhängig von der Mandanten-Berechtigung', () => {
  it('Wertebereich je Berechtigung', () => {
    const values = (p: 'huk' | 'vrk' | 'both' | 'none') =>
      versichererWertebereich(fakeContext({ permission: p })).map((o) => o.value);

    expect(values('huk')).toEqual(['HCR', 'HUK24']);
    expect(values('vrk')).toEqual(['VRK']);
    expect(values('both')).toEqual(['HCR', 'HUK24', 'VRK']);
    expect(values('none')).toEqual([]);
  });

  it('nur VRK-berechtigt -> Feld unsichtbar / nicht bearbeitbar (aber relevant)', () => {
    expect(versichererSteuerung(fakeContext({ permission: 'vrk' }))).toEqual({
      sichtbar: false,
      bearbeitbar: false,
      relevant: true,
    });
    expect(versichererSteuerung(fakeContext({ permission: 'both' })).sichtbar).toBe(true);
  });

  it('Standardwert je Berechtigung, solange kein gültiger Wert gesetzt ist', () => {
    expect(versichererDatenmanipulation(fakeContext({ permission: 'vrk' }))).toBe('VRK');
    expect(versichererDatenmanipulation(fakeContext({ permission: 'huk' }))).toBe('HCR');
    expect(versichererDatenmanipulation(fakeContext({ permission: 'both' }))).toBe('HCR');
  });

  it('gültige Benutzerauswahl bleibt erhalten', () => {
    expect(
      versichererDatenmanipulation(
        fakeContext({ permission: 'huk', values: { versicherer: 'HUK24' } }),
      ),
    ).toBe(KEEP);
  });

  it('ungültig gewordene Auswahl wird auf den Standard zurückgesetzt', () => {
    expect(
      versichererDatenmanipulation(
        fakeContext({ permission: 'vrk', values: { versicherer: 'HUK24' } }),
      ),
    ).toBe('VRK');
  });
});
