import { RISIKOART_CATALOG } from './risikoart-catalog';
import { canAddDeckung, risikoartOptions } from './combination';

const HCR = RISIKOART_CATALOG.HCR;
const values = (others: string[]) => risikoartOptions(HCR, others).map((o) => o.value);

describe('risikoartOptions', () => {
  it('entfernt bereits vergebene Risikoarten (jede nur einmal)', () => {
    expect(values(['23'])).not.toContain('23');
    expect(values(['23'])).toContain('17');
  });

  it('bietet RA 15 nur an, wenn es keine weitere Deckung gibt', () => {
    expect(values([])).toContain('15');
    expect(values(['23'])).not.toContain('15');
  });

  it('erlaubt bei vorhandenem Fahrer-RS (10) nur die Partner 19/119', () => {
    expect(values(['10']).sort()).toEqual(['119', '19']);
  });

  it('bietet Fahrer-RS nur allein oder neben genau einem Partner an', () => {
    expect(values([])).toContain('10');
    expect(values(['19'])).toContain('10'); // Partner daneben -> erlaubt
    expect(values(['17'])).not.toContain('10'); // Nicht-Partner daneben -> gesperrt
  });
});

describe('canAddDeckung', () => {
  it('nein bei alleinstehender RA 15', () => {
    expect(canAddDeckung(['15'])).toBe(false);
  });

  it('nein, wenn Fahrer-RS-Paar bereits komplett ist', () => {
    expect(canAddDeckung(['10', '19'])).toBe(false);
  });

  it('ja, solange dem Fahrer-RS noch der Partner fehlt', () => {
    expect(canAddDeckung(['10'])).toBe(true);
  });

  it('ja bei normaler Einzeldeckung', () => {
    expect(canAddDeckung(['23'])).toBe(true);
  });
});
