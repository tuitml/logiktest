import { TestBed } from '@angular/core/testing';

import { DeckungRuntime } from './deckung.runtime';
import { DeckungStore } from './deckung.store';
import { RA_STANDALONE } from './combination';

function optionValues(deckung: DeckungRuntime): string[] {
  return deckung.risikoartView().options.map((o) => String(o.value));
}

describe('DeckungStore – Kombinatorik-Verdrahtung', () => {
  let store: DeckungStore;

  beforeEach(() => {
    store = TestBed.inject(DeckungStore);
    store.initialize();
  });

  it('startet mit genau einer Deckung mit Standard-Risikoart 23 (HCR)', () => {
    expect(store.deckungen().length).toBe(1);
    expect(store.deckungen()[0].risikoartValue()).toBe('23');
  });

  it('bietet RA 15 nur bei genau einer Deckung an', () => {
    expect(optionValues(store.deckungen()[0])).toContain('15');

    store.add();
    expect(store.deckungen().length).toBe(2);
    for (const d of store.deckungen()) {
      expect(optionValues(d).some((w) => RA_STANDALONE.has(w))).toBe(false);
    }
  });

  it('jede Risikoart nur einmal – die zweite Deckung kollidiert nicht', () => {
    store.add();
    const [d1, d2] = store.deckungen();
    expect(d2.risikoartValue()).not.toBe(d1.risikoartValue());
    expect(optionValues(d2)).not.toContain(d1.risikoartValue());
  });

  it('Fahrer-RS (10) ist neben einer Nicht-Partner-Deckung nicht wählbar', () => {
    store.add();
    const [d1] = store.deckungen();
    expect(optionValues(d1)).not.toContain('10');
  });

  it('Fahrer-RS (10) allein gesetzt zwingt die neue Deckung auf einen Partner und sperrt weitere', () => {
    const [d1] = store.deckungen();
    store.changeField(d1, 'risikoart', '10');
    expect(d1.risikoartValue()).toBe('10');

    store.add();
    const d2 = store.deckungen()[1];
    expect(optionValues(d2).sort()).toEqual(['119', '19']);
    expect(['19', '119']).toContain(d2.risikoartValue());
    expect(store.canAdd()).toBe(false);
  });

  it('nach dem Entfernen der zweiten Deckung ist RA 15 wieder wählbar', () => {
    store.add();
    store.remove(store.deckungen()[1]);
    expect(store.deckungen().length).toBe(1);
    expect(optionValues(store.deckungen()[0])).toContain('15');
  });
});
