import { TestBed } from '@angular/core/testing';

import { AuthStore } from '../../../core/auth/auth.store';
import { DeckungStore } from '../../deckungen/deckung.store';
import { VertragsdatenStore } from '../vertragsdaten.store';
import { VersichererFieldComponent } from './versicherer-field.component';

describe('VersichererFieldComponent – Deckungen bei Versichererwechsel', () => {
  let deckungen: DeckungStore;
  let vertragsdaten: VertragsdatenStore;
  let change: (value: unknown) => void;

  beforeEach(() => {
    TestBed.inject(AuthStore).setClaims(['huk', 'vrk']);
    vertragsdaten = TestBed.inject(VertragsdatenStore);
    vertragsdaten.store.initialize();
    deckungen = TestBed.inject(DeckungStore);
    deckungen.initialize();

    const fixture = TestBed.createComponent(VersichererFieldComponent);
    const component = fixture.componentInstance as unknown as { change(v: unknown): void };
    change = (v) => component.change(v);
  });

  it('verwirft alle Deckungen und startet neu mit der Default-Deckung des neuen Versicherers', () => {
    deckungen.add();
    expect(deckungen.deckungen().length).toBe(2);

    change('VRK');

    expect(deckungen.deckungen().length).toBe(1);
    expect(deckungen.deckungen()[0].risikoartValue()).toBe('300023'); // VRK-Standard
  });

  it('lässt die Deckungen unangetastet, wenn sich der Versicherer nicht ändert', () => {
    deckungen.add();
    const before = deckungen.deckungen();

    change(vertragsdaten.store.field('versicherer').value()); // gleicher Wert

    expect(deckungen.deckungen()).toBe(before);
    expect(deckungen.deckungen().length).toBe(2);
  });
});
