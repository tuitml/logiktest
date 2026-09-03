import { KEEP } from '../../../core/engine';
import { fakeContext } from '../../testing/fake-context';
import { arbDatenmanipulation } from './arb.datenmanipulation';

describe('arbDatenmanipulation', () => {
  it('leitet die Jahreszahl aus Stelle 2+3 des Tarifs ab', () => {
    expect(arbDatenmanipulation(fakeContext({ values: { tarif: 'N1526' } }))).toBe(2015);
    expect(arbDatenmanipulation(fakeContext({ values: { tarif: 'S2426' } }))).toBe(2024);
    expect(arbDatenmanipulation(fakeContext({ values: { tarif: 'B2013' } }))).toBe(2020);
  });

  it('liefert undefined ohne verwertbaren Tarif', () => {
    expect(arbDatenmanipulation(fakeContext({ values: {} }))).toBeUndefined();
    expect(arbDatenmanipulation(fakeContext({ values: { tarif: 'N' } }))).toBeUndefined();
  });

  it('gibt nie KEEP zurück (immer abgeleitet)', () => {
    expect(arbDatenmanipulation(fakeContext({ values: { tarif: 'N1526' } }))).not.toBe(KEEP);
  });
});
