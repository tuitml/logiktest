import { RISIKOART_KATALOG } from './risikoart-katalog';
import { kannDeckungHinzufuegen, risikoartOptionen } from './kombinatorik';

const HCR = RISIKOART_KATALOG.HCR;

describe('risikoartOptionen', () => {
  it('entfernt bereits vergebene Risikoarten (jede nur einmal)', () => {
    const werte = risikoartOptionen(HCR, ['23'], undefined).map((o) => o.wert);
    expect(werte).not.toContain('23');
    expect(werte).toContain('17');
  });

  it('lässt den eigenen aktuellen Wert wählbar', () => {
    const werte = risikoartOptionen(HCR, ['23'], '23').map((o) => o.wert);
    expect(werte).toContain('23');
  });

  it('erlaubt bei vorhandenem Fahrer-RS (10) nur die Partner 19/119', () => {
    const werte = risikoartOptionen(HCR, ['10'], undefined).map((o) => o.wert);
    expect(werte.sort()).toEqual(['119', '19']);
  });
});

describe('kannDeckungHinzufuegen', () => {
  it('nein bei alleinstehender RA 15', () => {
    expect(kannDeckungHinzufuegen(['15'])).toBe(false);
  });

  it('nein, wenn Fahrer-RS-Paar bereits komplett ist', () => {
    expect(kannDeckungHinzufuegen(['10', '19'])).toBe(false);
  });

  it('ja bei normaler Einzeldeckung', () => {
    expect(kannDeckungHinzufuegen(['23'])).toBe(true);
  });
});
