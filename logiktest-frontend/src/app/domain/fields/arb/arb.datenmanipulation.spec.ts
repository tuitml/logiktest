import { BEHALTEN } from '../../../core/engine';
import { fakeKontext } from '../../testing/fake-kontext';
import { arbDatenmanipulation } from './arb.datenmanipulation';

describe('arbDatenmanipulation', () => {
  it('leitet die Jahreszahl aus Stelle 2+3 des Tarifs ab', () => {
    expect(arbDatenmanipulation(fakeKontext({ werte: { tarif: 'N1526' } }))).toEqual({ wert: 2015 });
    expect(arbDatenmanipulation(fakeKontext({ werte: { tarif: 'S2426' } }))).toEqual({ wert: 2024 });
    expect(arbDatenmanipulation(fakeKontext({ werte: { tarif: 'B2013' } }))).toEqual({ wert: 2020 });
  });

  it('liefert undefined ohne verwertbaren Tarif', () => {
    expect(arbDatenmanipulation(fakeKontext({ werte: {} }))).toEqual({ wert: undefined });
    expect(arbDatenmanipulation(fakeKontext({ werte: { tarif: 'N' } }))).toEqual({ wert: undefined });
  });

  it('gibt nie BEHALTEN zurück (immer abgeleitet)', () => {
    expect(arbDatenmanipulation(fakeKontext({ werte: { tarif: 'N1526' } }))).not.toBe(BEHALTEN);
  });
});
