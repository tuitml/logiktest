import { RISIKOART_KATALOG } from './risikoart-katalog';
import { kannDeckungHinzufuegen, risikoartOptionen } from './kombinatorik';

const HCR = RISIKOART_KATALOG.HCR;
const werte = (andere: string[]) => risikoartOptionen(HCR, andere).map((o) => o.wert);

describe('risikoartOptionen', () => {
  it('entfernt bereits vergebene Risikoarten (jede nur einmal)', () => {
    expect(werte(['23'])).not.toContain('23');
    expect(werte(['23'])).toContain('17');
  });

  it('bietet RA 15 nur an, wenn es keine weitere Deckung gibt', () => {
    expect(werte([])).toContain('15');
    expect(werte(['23'])).not.toContain('15');
  });

  it('erlaubt bei vorhandenem Fahrer-RS (10) nur die Partner 19/119', () => {
    expect(werte(['10']).sort()).toEqual(['119', '19']);
  });

  it('bietet Fahrer-RS nur allein oder neben genau einem Partner an', () => {
    expect(werte([])).toContain('10');
    expect(werte(['19'])).toContain('10'); // Partner daneben -> erlaubt
    expect(werte(['17'])).not.toContain('10'); // Nicht-Partner daneben -> gesperrt
  });
});

describe('kannDeckungHinzufuegen', () => {
  it('nein bei alleinstehender RA 15', () => {
    expect(kannDeckungHinzufuegen(['15'])).toBe(false);
  });

  it('nein, wenn Fahrer-RS-Paar bereits komplett ist', () => {
    expect(kannDeckungHinzufuegen(['10', '19'])).toBe(false);
  });

  it('ja, solange dem Fahrer-RS noch der Partner fehlt', () => {
    expect(kannDeckungHinzufuegen(['10'])).toBe(true);
  });

  it('ja bei normaler Einzeldeckung', () => {
    expect(kannDeckungHinzufuegen(['23'])).toBe(true);
  });
});
