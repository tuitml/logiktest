import { TestBed } from '@angular/core/testing';

import { DeckungRuntime } from './deckung.runtime';
import { DeckungStore } from './deckung.store';
import { RA_ALLEINSTEHEND } from './kombinatorik';

function optionenWerte(deckung: DeckungRuntime): string[] {
  return deckung.risikoartView().optionen.map((o) => String(o.wert));
}

describe('DeckungStore – Kombinatorik-Verdrahtung', () => {
  let store: DeckungStore;

  beforeEach(() => {
    store = TestBed.inject(DeckungStore);
    store.initialisieren();
  });

  it('startet mit genau einer Deckung mit Standard-Risikoart 23 (HCR)', () => {
    expect(store.deckungen().length).toBe(1);
    expect(store.deckungen()[0].risikoartWert()).toBe('23');
  });

  it('bietet RA 15 nur bei genau einer Deckung an', () => {
    expect(optionenWerte(store.deckungen()[0])).toContain('15');

    store.hinzufuegen();
    expect(store.deckungen().length).toBe(2);
    for (const d of store.deckungen()) {
      expect(optionenWerte(d).some((w) => RA_ALLEINSTEHEND.has(w))).toBe(false);
    }
  });

  it('jede Risikoart nur einmal – die zweite Deckung kollidiert nicht', () => {
    store.hinzufuegen();
    const [d1, d2] = store.deckungen();
    expect(d2.risikoartWert()).not.toBe(d1.risikoartWert());
    expect(optionenWerte(d2)).not.toContain(d1.risikoartWert());
  });

  it('Fahrer-RS (10) ist neben einer Nicht-Partner-Deckung nicht wählbar', () => {
    store.hinzufuegen();
    const [d1] = store.deckungen();
    // d2 hat als Standard eine "normale" RA (kein Partner) -> 10 fällt bei d1 weg
    expect(optionenWerte(d1)).not.toContain('10');
  });

  it('Fahrer-RS (10) allein gesetzt zwingt die neue Deckung auf einen Partner und sperrt weitere', () => {
    const [d1] = store.deckungen();
    store.aendereFeld(d1, 'risikoart', '10');
    expect(d1.risikoartWert()).toBe('10');

    store.hinzufuegen();
    const d2 = store.deckungen()[1];
    expect(optionenWerte(d2).sort()).toEqual(['119', '19']);
    expect(['19', '119']).toContain(d2.risikoartWert());
    expect(store.kannHinzufuegen()).toBe(false);
  });

  it('nach dem Entfernen der zweiten Deckung ist RA 15 wieder wählbar', () => {
    store.hinzufuegen();
    store.entfernen(store.deckungen()[1]);
    expect(store.deckungen().length).toBe(1);
    expect(optionenWerte(store.deckungen()[0])).toContain('15');
  });
});
